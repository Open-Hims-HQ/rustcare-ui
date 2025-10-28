/**
 * Permission-based UI components
 * Automatically show/hide/disable elements based on permissions
 */

import { type ReactNode } from 'react';
import { usePermission, useAnyPermission, useAllPermissions } from '~/hooks/usePermissions';
import type { PermissionCheck } from '~/lib/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  permission: PermissionCheck;
  fallback?: ReactNode;
  fallbackType?: 'hide' | 'show' | 'disabled';
}

/**
 * Guard component that conditionally renders based on permissions
 */
export function PermissionGuard({
  children,
  permission,
  fallback = null,
  fallbackType = 'hide',
}: PermissionGuardProps) {
  const hasAccess = usePermission(permission);

  if (!hasAccess) {
    switch (fallbackType) {
      case 'hide':
        return null;
      case 'show':
        return <>{fallback}</>;
      case 'disabled':
        return <div className="opacity-50 cursor-not-allowed pointer-events-none">{children}</div>;
      default:
        return null;
    }
  }

  return <>{children}</>;
}

interface AnyPermissionGuardProps {
  children: ReactNode;
  permissions: PermissionCheck[];
  fallback?: ReactNode;
  fallbackType?: 'hide' | 'show' | 'disabled';
}

/**
 * Guard that requires ANY of the specified permissions
 */
export function AnyPermissionGuard({
  children,
  permissions,
  fallback = null,
  fallbackType = 'hide',
}: AnyPermissionGuardProps) {
  const hasAccess = useAnyPermission(permissions);

  if (!hasAccess) {
    switch (fallbackType) {
      case 'hide':
        return null;
      case 'show':
        return <>{fallback}</>;
      case 'disabled':
        return <div className="opacity-50 cursor-not-allowed pointer-events-none">{children}</div>;
      default:
        return null;
    }
  }

  return <>{children}</>;
}

interface AllPermissionsGuardProps {
  children: ReactNode;
  permissions: PermissionCheck[];
  fallback?: ReactNode;
  fallbackType?: 'hide' | 'show' | 'disabled';
}

/**
 * Guard that requires ALL of the specified permissions
 */
export function AllPermissionsGuard({
  children,
  permissions,
  fallback = null,
  fallbackType = 'hide',
}: AllPermissionsGuardProps) {
  const hasAccess = useAllPermissions(permissions);

  if (!hasAccess) {
    switch (fallbackType) {
      case 'hide':
        return null;
      case 'show':
        return <>{fallback}</>;
      case 'disabled':
        return <div className="opacity-50 cursor-not-allowed pointer-events-none">{children}</div>;
      default:
        return null;
    }
  }

  return <>{children}</>;
}

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: PermissionCheck;
  children: ReactNode;
  disabledMessage?: string;
}

/**
 * Button that disables based on permissions
 */
export function PermissionButton({
  permission,
  children,
  disabledMessage,
  className = '',
  ...props
}: PermissionButtonProps) {
  const hasAccess = usePermission(permission);

  return (
    <button
      {...props}
      disabled={!hasAccess || props.disabled}
      className={className}
      title={!hasAccess && disabledMessage ? disabledMessage : props.title}
    >
      {children}
    </button>
  );
}

interface PermissionLinkProps {
  permission: PermissionCheck;
  to: string;
  children: ReactNode;
  className?: string;
  hideIfDenied?: boolean;
}

/**
 * Link that shows/hides based on permissions
 */
export function PermissionLink({
  permission,
  to,
  children,
  className = '',
  hideIfDenied = true,
}: PermissionLinkProps) {
  const hasAccess = usePermission(permission);

  if (!hasAccess && hideIfDenied) {
    return null;
  }

  return (
    <a
      href={to}
      className={`${className} ${!hasAccess ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      {children}
    </a>
  );
}

interface PermissionInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  permission: PermissionCheck;
}

/**
 * Input that becomes readonly based on permissions
 */
export function PermissionInput({
  permission,
  ...props
}: PermissionInputProps) {
  const hasAccess = usePermission(permission);

  return (
    <input
      {...props}
      readOnly={!hasAccess || props.readOnly}
      disabled={!hasAccess || props.disabled}
      className={`${props.className || ''} ${!hasAccess ? 'opacity-70' : ''}`}
    />
  );
}

interface PermissionSectionProps {
  permission: PermissionCheck;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * Section that shows/hides entire UI sections based on permissions
 */
export function PermissionSection({
  permission,
  children,
  fallback,
  className = '',
}: PermissionSectionProps) {
  const hasAccess = usePermission(permission);

  if (!hasAccess) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return <div className={className}>{children}</div>;
}

interface ConditionalRenderProps {
  children: (hasPermission: boolean) => ReactNode;
  permission: PermissionCheck;
}

/**
 * Render prop component for custom permission logic
 */
export function ConditionalRender({
  children,
  permission,
}: ConditionalRenderProps) {
  const hasAccess = usePermission(permission);
  return <>{children(hasAccess)}</>;
}
