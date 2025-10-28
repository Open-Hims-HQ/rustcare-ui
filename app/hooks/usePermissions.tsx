/**
 * React hooks for permission-based rendering
 * Integrates with Zanzibar permission system
 */

import { useMemo } from 'react';
import { useMatches } from '@remix-run/react';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getAllowedActions,
  type UserContext,
  type PermissionCheck,
  type PermissionAction,
  type ResourceType,
} from '~/lib/permissions';

/**
 * Get user context from route loaders
 */
export function useUserContext(): UserContext | null {
  const matches = useMatches();
  
  // Look for user data in route loaders
  for (const match of matches) {
    if (match.data && typeof match.data === 'object') {
      const data = match.data as any;
      if (data.user) {
        return {
          userId: data.user.id || data.user.userId,
          roles: data.user.roles || [],
          organizationId: data.user.organizationId,
          attributes: data.user.attributes,
        };
      }
    }
  }
  
  return null;
}

/**
 * Check if user has permission
 */
export function usePermission(check: PermissionCheck): boolean {
  const user = useUserContext();
  
  return useMemo(() => {
    if (!user) return false;
    return hasPermission(user, check);
  }, [user, check]);
}

/**
 * Check if user has permission (returns true if no permission check provided)
 * Useful for optional permission checks in components
 */
export function useOptionalPermission(check: PermissionCheck | undefined | null): boolean {
  const user = useUserContext();
  
  return useMemo(() => {
    if (!check) return true; // No permission required
    if (!user) return false;
    return hasPermission(user, check);
  }, [user, check]);
}

/**
 * Check if user has any of the specified permissions
 */
export function useAnyPermission(checks: PermissionCheck[]): boolean {
  const user = useUserContext();
  
  return useMemo(() => {
    if (!user) return false;
    return hasAnyPermission(user, checks);
  }, [user, JSON.stringify(checks)]);
}

/**
 * Check if user has all specified permissions
 */
export function useAllPermissions(checks: PermissionCheck[]): boolean {
  const user = useUserContext();
  
  return useMemo(() => {
    if (!user) return false;
    return hasAllPermissions(user, checks);
  }, [user, JSON.stringify(checks)]);
}

/**
 * Get allowed actions for a resource
 */
export function useAllowedActions(
  resource: ResourceType,
  resourceId?: string
): PermissionAction[] {
  const user = useUserContext();
  
  return useMemo(() => {
    if (!user) return [];
    return getAllowedActions(user, resource, resourceId);
  }, [user, resource, resourceId]);
}

/**
 * Check multiple permissions at once
 */
export function usePermissions(
  checks: PermissionCheck[]
): Record<string, boolean> {
  const user = useUserContext();
  
  return useMemo(() => {
    if (!user) {
      return Object.fromEntries(checks.map((_, i) => [i.toString(), false]));
    }
    
    return Object.fromEntries(
      checks.map((check, i) => [
        `${check.resource}:${check.action}:${check.resourceId || 'all'}`,
        hasPermission(user, check),
      ])
    );
  }, [user, JSON.stringify(checks)]);
}

/**
 * Check if user has a specific role
 */
export function useHasRole(role: string | string[]): boolean {
  const user = useUserContext();
  
  return useMemo(() => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.some(r => user.roles.includes(r));
  }, [user, Array.isArray(role) ? role.join(',') : role]);
}

/**
 * Get user's roles
 */
export function useUserRoles(): string[] {
  const user = useUserContext();
  return useMemo(() => user?.roles || [], [user]);
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const user = useUserContext();
  return user !== null;
}
