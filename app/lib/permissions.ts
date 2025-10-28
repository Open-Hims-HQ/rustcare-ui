/**
 * Zanzibar-style Permission System
 * Based on Google's Zanzibar for fine-grained access control
 * Supports RBAC, ABAC, and ReBAC
 */

export type PermissionAction = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'list'
  | 'execute'
  | 'rotate'
  | 'audit'
  | 'configure';

export type ResourceType = 
  | 'secret'
  | 'secret_provider'
  | 'audit_log'
  | 'user'
  | 'role'
  | 'organization'
  | 'device'
  | 'employee'
  | 'resource'
  | 'compliance'
  | 'geographic';

/**
 * Permission tuple in Zanzibar format
 * Format: <namespace>:<object_type>:<object_id>#<relation>@<subject_type>:<subject_id>
 */
export interface PermissionTuple {
  namespace: string;
  objectType: ResourceType;
  objectId: string;
  relation: string;
  subjectType: 'user' | 'role' | 'group' | 'organization';
  subjectId: string;
}

/**
 * Permission check request
 */
export interface PermissionCheck {
  resource: ResourceType;
  resourceId?: string;
  action: PermissionAction;
  context?: Record<string, any>; // For ABAC attributes
}

/**
 * User context for permission checks
 */
export interface UserContext {
  userId: string;
  roles: string[];
  organizationId?: string;
  attributes?: Record<string, any>; // For ABAC
}

/**
 * Permission configuration for UI components
 */
export interface PermissionConfig {
  resource: ResourceType;
  action: PermissionAction;
  resourceId?: string;
  fallback?: 'hide' | 'disable' | 'show'; // What to do if permission denied
}

/**
 * Check if user has permission (client-side check, must be verified server-side)
 */
export function hasPermission(
  user: UserContext,
  check: PermissionCheck
): boolean {
  // TODO: Implement real Zanzibar permission check via API
  // For now, basic RBAC implementation
  
  const { resource, action, resourceId, context } = check;
  
  // System admin has all permissions
  if (user.roles.includes('system_admin')) {
    return true;
  }

  // Resource-specific permission checks
  switch (resource) {
    case 'secret':
      return hasSecretPermission(user, action, resourceId, context);
    case 'secret_provider':
      return hasSecretProviderPermission(user, action);
    case 'audit_log':
      return hasAuditPermission(user, action);
    case 'user':
      return hasUserPermission(user, action);
    case 'role':
      return hasRolePermission(user, action);
    case 'organization':
      return hasOrganizationPermission(user, action);
    default:
      return false;
  }
}

/**
 * Check secret permissions
 */
function hasSecretPermission(
  user: UserContext,
  action: PermissionAction,
  secretId?: string,
  context?: Record<string, any>
): boolean {
  // Security admin can manage secrets
  if (user.roles.includes('security_admin')) {
    return true;
  }

  // Secret manager can create, read, update secrets
  if (user.roles.includes('secret_manager')) {
    return ['create', 'read', 'update', 'list', 'rotate'].includes(action);
  }

  // Secret viewer can only read
  if (user.roles.includes('secret_viewer')) {
    return ['read', 'list'].includes(action);
  }

  // Application users can read secrets in their organization
  if (action === 'read' && context?.organizationId === user.organizationId) {
    return true;
  }

  return false;
}

/**
 * Check secret provider permissions
 */
function hasSecretProviderPermission(
  user: UserContext,
  action: PermissionAction
): boolean {
  // Only security admins can configure providers
  if (user.roles.includes('security_admin')) {
    return true;
  }

  // Secret managers can view provider status
  if (user.roles.includes('secret_manager') && ['read', 'list'].includes(action)) {
    return true;
  }

  return false;
}

/**
 * Check audit log permissions
 */
function hasAuditPermission(
  user: UserContext,
  action: PermissionAction
): boolean {
  // Auditors and security admins can view audit logs
  if (user.roles.includes('auditor') || 
      user.roles.includes('security_admin') ||
      user.roles.includes('compliance_officer')) {
    return ['read', 'list', 'audit'].includes(action);
  }

  return false;
}

/**
 * Check user management permissions
 */
function hasUserPermission(
  user: UserContext,
  action: PermissionAction
): boolean {
  if (user.roles.includes('user_admin')) {
    return true;
  }

  // Organization admins can manage users in their org
  if (user.roles.includes('org_admin')) {
    return true;
  }

  return false;
}

/**
 * Check role management permissions
 */
function hasRolePermission(
  user: UserContext,
  action: PermissionAction
): boolean {
  return user.roles.includes('role_admin') || user.roles.includes('user_admin');
}

/**
 * Check organization permissions
 */
function hasOrganizationPermission(
  user: UserContext,
  action: PermissionAction
): boolean {
  if (user.roles.includes('org_admin')) {
    return true;
  }

  // Users can read their own organization
  if (action === 'read' && user.organizationId) {
    return true;
  }

  return false;
}

/**
 * Batch permission check
 */
export function hasAnyPermission(
  user: UserContext,
  checks: PermissionCheck[]
): boolean {
  return checks.some(check => hasPermission(user, check));
}

/**
 * Check if user has all permissions
 */
export function hasAllPermissions(
  user: UserContext,
  checks: PermissionCheck[]
): boolean {
  return checks.every(check => hasPermission(user, check));
}

/**
 * Get allowed actions for a resource
 */
export function getAllowedActions(
  user: UserContext,
  resource: ResourceType,
  resourceId?: string
): PermissionAction[] {
  const allActions: PermissionAction[] = [
    'create', 'read', 'update', 'delete', 'list', 'execute', 'rotate', 'audit', 'configure'
  ];

  return allActions.filter(action =>
    hasPermission(user, { resource, action, resourceId })
  );
}

/**
 * Filter list based on permissions
 */
export function filterByPermissions<T extends { id: string }>(
  user: UserContext,
  items: T[],
  resource: ResourceType,
  action: PermissionAction = 'read'
): T[] {
  return items.filter(item =>
    hasPermission(user, { resource, action, resourceId: item.id })
  );
}

/**
 * API permission check (call backend Zanzibar service)
 */
export async function checkPermissionAPI(
  check: PermissionCheck,
  options?: RequestInit
): Promise<boolean> {
  try {
    const response = await fetch('/api/permissions/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(check),
      ...options,
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.allowed === true;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

/**
 * Batch API permission check
 */
export async function checkPermissionsAPI(
  checks: PermissionCheck[],
  options?: RequestInit
): Promise<Record<string, boolean>> {
  try {
    const response = await fetch('/api/permissions/check-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checks }),
      ...options,
    });

    if (!response.ok) {
      return {};
    }

    const result = await response.json();
    return result.results || {};
  } catch (error) {
    console.error('Batch permission check failed:', error);
    return {};
  }
}

/**
 * Role definitions (can be extended)
 */
export const ROLES = {
  SYSTEM_ADMIN: 'system_admin',
  SECURITY_ADMIN: 'security_admin',
  SECRET_MANAGER: 'secret_manager',
  SECRET_VIEWER: 'secret_viewer',
  USER_ADMIN: 'user_admin',
  ORG_ADMIN: 'org_admin',
  ROLE_ADMIN: 'role_admin',
  AUDITOR: 'auditor',
  COMPLIANCE_OFFICER: 'compliance_officer',
} as const;

/**
 * Common permission presets
 */
export const PERMISSIONS = {
  // Secrets
  CREATE_SECRET: { resource: 'secret' as ResourceType, action: 'create' as PermissionAction },
  READ_SECRET: { resource: 'secret' as ResourceType, action: 'read' as PermissionAction },
  UPDATE_SECRET: { resource: 'secret' as ResourceType, action: 'update' as PermissionAction },
  DELETE_SECRET: { resource: 'secret' as ResourceType, action: 'delete' as PermissionAction },
  LIST_SECRETS: { resource: 'secret' as ResourceType, action: 'list' as PermissionAction },
  ROTATE_SECRET: { resource: 'secret' as ResourceType, action: 'rotate' as PermissionAction },
  
  // Secret Providers
  CONFIGURE_PROVIDER: { resource: 'secret_provider' as ResourceType, action: 'configure' as PermissionAction },
  READ_PROVIDER: { resource: 'secret_provider' as ResourceType, action: 'read' as PermissionAction },
  
  // Audit
  READ_AUDIT: { resource: 'audit_log' as ResourceType, action: 'read' as PermissionAction },
  AUDIT_LOGS: { resource: 'audit_log' as ResourceType, action: 'audit' as PermissionAction },
} as const;
