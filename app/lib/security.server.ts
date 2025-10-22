/**
 * Server-Side Security for Remix Loaders/Actions
 * All security enforcement happens here on the server
 * 
 * Features:
 * - Session management with HttpOnly cookies
 * - CSRF validation
 * - Rate limiting
 * - Permission checks
 * - Audit logging
 * - Request validation
 */

import { redirect, json } from "@remix-run/node";
import type { Session } from "@remix-run/node";

/**
 * Session data structure
 */
export interface UserSession {
  userId: string;
  email: string;
  name: string;
  roles: string[];
  organizationId?: string;
  createdAt: number;
  lastActivity: number;
}

/**
 * Rate limiter for server-side enforcement
 */
class ServerRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number = 100;
  private readonly timeWindow: number = 60000; // 1 minute

  check(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests
    const recent = requests.filter(time => now - time < this.timeWindow);
    
    if (recent.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }
    
    recent.push(now);
    this.requests.set(identifier, recent);
    return true;
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, times] of this.requests.entries()) {
      const recent = times.filter(time => now - time < this.timeWindow);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }
}

const rateLimiter = new ServerRateLimiter();

// Cleanup rate limiter every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}

/**
 * Validate CSRF token
 */
export function validateCSRF(request: Request, sessionToken: string | null): boolean {
  const method = request.method.toUpperCase();
  
  // Only validate CSRF for state-changing requests
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true;
  }

  // Get CSRF token from header
  const csrfHeader = request.headers.get('X-CSRF-Token');
  
  // Get CSRF token from cookie
  const cookies = request.headers.get('Cookie') || '';
  const csrfCookie = cookies
    .split(';')
    .find(c => c.trim().startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  // Both must match and be present
  return !!(csrfHeader && csrfCookie && csrfHeader === csrfCookie);
}

/**
 * Check rate limit for request
 */
export function checkRateLimit(request: Request): boolean {
  // Use IP address as identifier
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
              request.headers.get('x-real-ip') || 
              'unknown';
  
  return rateLimiter.check(ip);
}

/**
 * Get user session from request
 * In production, this would integrate with your session store
 */
export async function getUserSession(request: Request): Promise<UserSession | null> {
  // TODO: Implement proper session management
  // For now, return null (unauthenticated)
  
  // Example with cookie-based session:
  // const session = await getSession(request.headers.get("Cookie"));
  // return session.get("user");
  
  return null;
}

/**
 * Require authenticated user
 */
export async function requireUser(request: Request): Promise<UserSession> {
  const user = await getUserSession(request);
  
  if (!user) {
    throw redirect('/login', {
      headers: {
        'Set-Cookie': 'redirectTo=' + request.url + '; Path=/; HttpOnly; SameSite=Lax',
      },
    });
  }

  // Check session expiry (e.g., 8 hours)
  const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;
  if (Date.now() - user.lastActivity > SESSION_TIMEOUT) {
    throw redirect('/login?reason=expired');
  }

  return user;
}

/**
 * Check if user has required permission
 */
export async function checkPermission(
  request: Request,
  resource: string,
  action: string
): Promise<boolean> {
  const user = await getUserSession(request);
  if (!user) return false;

  // TODO: Implement Zanzibar permission check
  // For now, allow all authenticated users
  // In production:
  // const response = await fetch(`${API_BASE_URL}/auth/check`, {
  //   method: 'POST',
  //   body: JSON.stringify({ user_id: user.userId, resource, action }),
  // });
  // return response.ok && (await response.json()).allowed;

  return true;
}

/**
 * Require specific permission
 */
export async function requirePermission(
  request: Request,
  resource: string,
  action: string
): Promise<void> {
  const hasPermission = await checkPermission(request, resource, action);
  
  if (!hasPermission) {
    throw json(
      { error: 'Forbidden', message: 'You do not have permission to perform this action' },
      { status: 403 }
    );
  }
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  timestamp: number;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: any;
}

/**
 * Log audit event (HIPAA compliance)
 */
export async function logAudit(request: Request, entry: Omit<AuditLogEntry, 'timestamp' | 'ipAddress' | 'userAgent'>): Promise<void> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const fullEntry: AuditLogEntry = {
    ...entry,
    timestamp: Date.now(),
    ipAddress: ip,
    userAgent,
  };

  // TODO: Send to audit logging service
  // In production, write to database or audit service
  console.info('[AUDIT]', JSON.stringify(fullEntry));

  // For HIPAA compliance, also send to secure audit service
  // await auditService.log(fullEntry);
}

/**
 * Validate request and enforce security
 * Use this in every loader/action
 */
export async function validateRequest(
  request: Request,
  options?: {
    requireAuth?: boolean;
    requirePermission?: { resource: string; action: string };
    skipCSRF?: boolean;
    skipRateLimit?: boolean;
  }
): Promise<UserSession | null> {
  const { 
    requireAuth = false, 
    requirePermission,
    skipCSRF = false,
    skipRateLimit = false 
  } = options || {};

  // 1. Check rate limit
  if (!skipRateLimit && !checkRateLimit(request)) {
    throw json(
      { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  // 2. Get user session
  const user = await getUserSession(request);

  // 3. Validate CSRF for authenticated requests
  if (!skipCSRF && user) {
    const csrfValid = validateCSRF(request, user.userId);
    if (!csrfValid) {
      await logAudit(request, {
        userId: user.userId,
        action: 'csrf_failure',
        resource: new URL(request.url).pathname,
        success: false,
      });
      throw json(
        { error: 'Forbidden', message: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  // 4. Require authentication if needed
  if (requireAuth && !user) {
    throw redirect('/login');
  }

  // 5. Check permissions if needed
  if (requirePermission && user) {
    const hasPermission = await checkPermission(
      request,
      requirePermission.resource,
      requirePermission.action
    );

    if (!hasPermission) {
      await logAudit(request, {
        userId: user.userId,
        action: 'permission_denied',
        resource: requirePermission.resource,
        success: false,
        details: { requiredAction: requirePermission.action },
      });

      throw json(
        { error: 'Forbidden', message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
  }

  return user;
}

/**
 * Sanitize input to prevent injection attacks
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove null bytes and control characters
    return input.replace(/\0/g, '').replace(/[\x00-\x1F\x7F]/g, '');
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return input;
}
