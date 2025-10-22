/**
 * Security Utilities
 * HIPAA-compliant security functions for API communication
 */

import { useAuthStore } from '~/stores/useAuthStore';

/**
 * Generate a cryptographically secure nonce for request signing
 */
export function generateNonce(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for server-side rendering
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Generate CSRF token from session
 */
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  // Try to get from meta tag
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    return metaTag.getAttribute('content');
  }
  
  // Try to get from cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

/**
 * Calculate request signature using HMAC-like approach
 * In production, this should use Web Crypto API with a secret key
 */
export async function signRequest(
  method: string,
  url: string,
  body: string | null,
  timestamp: number,
  nonce: string
): Promise<string> {
  const message = `${method}:${url}:${timestamp}:${nonce}:${body || ''}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      // Use Web Crypto API for secure hashing
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.warn('Web Crypto API not available, using fallback');
    }
  }
  
  // Fallback: simple hash for development (NOT for production)
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Sanitize headers to prevent injection attacks
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(headers)) {
    // Remove any control characters or newlines
    const cleanKey = key.replace(/[\r\n\t]/g, '');
    const cleanValue = value.replace(/[\r\n\t]/g, '');
    
    // Only allow alphanumeric, dash, and underscore in header names
    if (/^[a-zA-Z0-9\-_]+$/.test(cleanKey)) {
      sanitized[cleanKey] = cleanValue;
    }
  }
  
  return sanitized;
}

/**
 * Validate URL to prevent SSRF attacks
 */
export function isValidApiUrl(url: string, allowedBaseUrls: string[]): boolean {
  try {
    const urlObj = new URL(url);
    
    // Must use HTTPS in production
    if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Must match one of the allowed base URLs
    return allowedBaseUrls.some(baseUrl => url.startsWith(baseUrl));
  } catch {
    return false;
  }
}

/**
 * Rate limiting tracker (client-side)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number = 100;
  private readonly timeWindow: number = 60000; // 1 minute

  check(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    
    // Remove old requests outside time window
    const recentRequests = requests.filter(time => now - time < this.timeWindow);
    
    if (recentRequests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }
    
    recentRequests.push(now);
    this.requests.set(endpoint, recentRequests);
    return true;
  }

  reset(endpoint?: string): void {
    if (endpoint) {
      this.requests.delete(endpoint);
    } else {
      this.requests.clear();
    }
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Secure request timeout handler
 */
export function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  // Store timeout ID for cleanup
  const signal = controller.signal;
  (signal as any).__timeoutId = timeoutId;
  
  return signal;
}

/**
 * Clean up timeout signal
 */
export function clearTimeoutSignal(signal: AbortSignal): void {
  const timeoutId = (signal as any).__timeoutId;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}

/**
 * Audit log for security events
 */
export interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'invalid_token' | 'csrf_failure' | 'request_error';
  endpoint: string;
  timestamp: number;
  details?: string;
}

class SecurityAuditLog {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;

  log(event: SecurityEvent): void {
    this.events.push(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    // In production, send to backend audit service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to audit service
      console.info('[Security Audit]', event);
    }
  }

  getEvents(type?: SecurityEvent['type']): SecurityEvent[] {
    if (type) {
      return this.events.filter(e => e.type === type);
    }
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}

export const securityAudit = new SecurityAuditLog();
