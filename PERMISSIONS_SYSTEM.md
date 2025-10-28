# Secrets Management UI - Permission System Implementation

## Overview
Comprehensive permission-based UI system for RustCare secrets management, built on Zanzibar-style authorization with RBAC, ABAC, and ReBAC support.

## Architecture

### 1. Permission System (`/app/lib/permissions.ts`)

#### Core Concepts
- **Resource-based permissions**: Fine-grained control over secrets, providers, audit logs, etc.
- **Action-based access**: create, read, update, delete, list, execute, rotate, audit, configure
- **Zanzibar-style tuples**: `<namespace>:<object_type>:<object_id>#<relation>@<subject_type>:<subject_id>`

#### Permission Types
```typescript
export type PermissionAction = 
  | 'create' | 'read' | 'update' | 'delete' | 'list'
  | 'execute' | 'rotate' | 'audit' | 'configure';

export type ResourceType = 
  | 'secret' | 'secret_provider' | 'audit_log'
  | 'user' | 'role' | 'organization' | 'device'
  | 'employee' | 'resource' | 'compliance' | 'geographic';
```

#### Role Hierarchy
```
system_admin (all permissions)
  ├── security_admin (secrets, providers, audit)
  │   ├── secret_manager (create, read, update, rotate secrets)
  │   └── secret_viewer (read secrets only)
  ├── user_admin (user management)
  │   ├── org_admin (organization scope)
  │   └── role_admin (role management)
  └── compliance_officer (audit logs, compliance)
      └── auditor (read audit logs)
```

### 2. React Hooks (`/app/hooks/usePermissions.tsx`)

#### Available Hooks
```typescript
// Check single permission
const canCreate = usePermission({ 
  resource: 'secret', 
  action: 'create' 
});

// Check multiple permissions (ANY)
const hasAccess = useAnyPermission([
  { resource: 'secret', action: 'read' },
  { resource: 'secret', action: 'list' }
]);

// Check multiple permissions (ALL)
const isFullAdmin = useAllPermissions([
  { resource: 'secret', action: 'create' },
  { resource: 'secret', action: 'delete' }
]);

// Get allowed actions
const actions = useAllowedActions('secret', 'db-password-123');

// Check roles
const isAdmin = useHasRole('system_admin');
const hasAnyRole = useHasRole(['security_admin', 'secret_manager']);

// Get user context
const user = useUserContext();
const roles = useUserRoles();
const isAuthenticated = useIsAuthenticated();
```

### 3. UI Components (`/app/components/PermissionGuard.tsx`)

#### Guard Components
```tsx
// Hide element if no permission
<PermissionGuard permission={{ resource: 'secret', action: 'delete' }}>
  <DeleteButton />
</PermissionGuard>

// Show fallback
<PermissionGuard 
  permission={{ resource: 'secret', action: 'create' }}
  fallbackType="show"
  fallback={<div>No permission to create secrets</div>}
>
  <CreateButton />
</PermissionGuard>

// Disable element
<PermissionGuard 
  permission={{ resource: 'secret', action: 'update' }}
  fallbackType="disabled"
>
  <EditForm />
</PermissionGuard>
```

#### Specialized Components
```tsx
// Permission-aware button
<PermissionButton
  permission={{ resource: 'secret', action: 'rotate' }}
  disabledMessage="You need secret_manager role to rotate secrets"
  onClick={handleRotate}
>
  Rotate Secret
</PermissionButton>

// Permission-aware input
<PermissionInput
  permission={{ resource: 'secret', action: 'update' }}
  value={secretValue}
  onChange={handleChange}
/>

// Conditional rendering
<ConditionalRender permission={{ resource: 'secret', action: 'read' }}>
  {(hasPermission) => (
    hasPermission ? <SecretValue /> : <RedactedValue />
  )}
</ConditionalRender>
```

### 4. Server-Side Security (`/app/lib/security.server.ts`)

#### Request Validation
```typescript
// In loader
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await validateRequest(request, {
    requireAuth: true,
    requirePermission: { resource: 'secret', action: 'list' },
  });
  
  return json({ secrets, user });
}

// In action
export async function action({ request }: ActionFunctionArgs) {
  await requirePermission(request, 'secret', 'delete');
  
  await logAudit(request, {
    action: 'secret_deleted',
    resource: 'secret',
    resourceId: secretKey,
    success: true,
  });
  
  // ... perform deletion
}
```

#### Security Features
- ✅ Session management with HttpOnly cookies
- ✅ CSRF validation for state-changing requests
- ✅ Rate limiting (100 req/min per IP)
- ✅ Audit logging (HIPAA compliant)
- ✅ Input sanitization
- ✅ Permission checks on every request

## Routes & Layouts

### Settings Layout (`/app/routes/settings.tsx`)
- Permission-based sidebar navigation
- Only shows menu items user has access to
- Sticky sidebar with active state
- Nested routing with `<Outlet />`

### Secrets Routes
```
/settings
  ├── /secrets              - List secrets (LIST_SECRETS)
  ├── /secrets/providers    - Configure providers (READ_PROVIDER)
  └── /secrets/audit        - View audit logs (READ_AUDIT)
```

### Route Permissions
| Route | Required Permission | Roles |
|-------|---------------------|-------|
| `/settings/secrets` | `secret:list` | security_admin, secret_manager, secret_viewer |
| `/settings/secrets` (create) | `secret:create` | security_admin, secret_manager |
| `/settings/secrets` (rotate) | `secret:rotate` | security_admin, secret_manager |
| `/settings/secrets` (delete) | `secret:delete` | security_admin |
| `/settings/secrets/providers` | `secret_provider:read` | security_admin, secret_manager |
| `/settings/secrets/providers` (configure) | `secret_provider:configure` | security_admin |
| `/settings/secrets/audit` | `audit_log:read` | security_admin, auditor, compliance_officer |

## UI Features

### Secrets Management
```tsx
// Features with permission checks:
- ✅ Create Secret (CREATE_SECRET)
- ✅ View Secret (READ_SECRET) - eye icon toggles visibility
- ✅ Rotate Secret (ROTATE_SECRET) - manual or auto-rotation
- ✅ Delete Secret (DELETE_SECRET) - confirmation required
- ✅ Search & Filter
- ✅ Tags & Metadata
- ✅ Version History
- ✅ Health Status Dashboard
```

### Provider Management
```tsx
// Features:
- ✅ Add Provider (CONFIGURE_PROVIDER)
- ✅ Edit Provider (CONFIGURE_PROVIDER)
- ✅ Test Connection (READ_PROVIDER)
- ✅ Health Monitoring
- ✅ Priority Configuration
- ✅ Enable/Disable Providers

// Supported Providers:
- HashiCorp Vault (Token, AppRole, K8s auth)
- AWS Secrets Manager
- Azure Key Vault
- GCP Secret Manager
- Kubernetes Secrets
- Environment Variables (fallback)
```

### Audit Log
```tsx
// Features:
- ✅ Event Timeline (READ_AUDIT)
- ✅ Filtering (type, user, secret key)
- ✅ Pagination
- ✅ Export to CSV (AUDIT_LOGS)
- ✅ Metadata Viewer
- ✅ Success/Failure Tracking

// Event Types:
- SecretAccessed
- SecretCreated
- SecretUpdated
- SecretDeleted
- SecretRotated
```

## Integration with Backend

### API Endpoints (to implement in rustcare-engine)

```rust
// Permission Check
POST /api/permissions/check
{
  "resource": "secret",
  "action": "read",
  "resource_id": "db-password-123"
}
Response: { "allowed": true }

// Batch Permission Check
POST /api/permissions/check-batch
{
  "checks": [
    { "resource": "secret", "action": "read" },
    { "resource": "secret", "action": "update" }
  ]
}
Response: { "results": { "secret:read:all": true, "secret:update:all": false } }

// Secrets CRUD
GET    /api/secrets
POST   /api/secrets
GET    /api/secrets/:key
PUT    /api/secrets/:key
DELETE /api/secrets/:key
POST   /api/secrets/:key/rotate

// Providers
GET    /api/secrets/providers
POST   /api/secrets/providers
PUT    /api/secrets/providers/:id
DELETE /api/secrets/providers/:id
GET    /api/secrets/providers/:id/health

// Audit
GET    /api/secrets/audit?page=1&per_page=50&event_type=SecretAccessed
```

## Security Best Practices

### Client-Side
1. ✅ **Defense in depth**: Client checks are UX only, server validates
2. ✅ **Minimal exposure**: Only load data user can access
3. ✅ **Graceful degradation**: Hide/disable UI elements without permission
4. ✅ **Clear feedback**: Show why action is disabled

### Server-Side
1. ✅ **Validate every request**: Use `validateRequest()` in all loaders/actions
2. ✅ **Audit everything**: Log all secret access and modifications
3. ✅ **CSRF protection**: Validate tokens on state-changing requests
4. ✅ **Rate limiting**: Prevent brute force and DoS
5. ✅ **Input sanitization**: Remove dangerous characters
6. ✅ **Session timeout**: 8-hour expiry for security

## Usage Examples

### Example 1: Protected Button
```tsx
import { PermissionGuard } from "~/components/PermissionGuard";
import { PERMISSIONS } from "~/lib/permissions";

function SecretActions() {
  return (
    <>
      <PermissionGuard permission={PERMISSIONS.ROTATE_SECRET}>
        <button onClick={rotateSecret}>Rotate</button>
      </PermissionGuard>
      
      <PermissionGuard permission={PERMISSIONS.DELETE_SECRET}>
        <button onClick={deleteSecret}>Delete</button>
      </PermissionGuard>
    </>
  );
}
```

### Example 2: Conditional Rendering
```tsx
import { usePermission } from "~/hooks/usePermissions";

function SecretDetails() {
  const canView = usePermission({ resource: 'secret', action: 'read' });
  const canEdit = usePermission({ resource: 'secret', action: 'update' });
  
  return (
    <div>
      {canView && <div>{secretValue}</div>}
      {canEdit && <EditButton />}
      {!canView && <div>Access Denied</div>}
    </div>
  );
}
```

### Example 3: Role-Based Navigation
```tsx
import { useHasRole } from "~/hooks/usePermissions";

function Navigation() {
  const isAdmin = useHasRole(['system_admin', 'security_admin']);
  const canAudit = useHasRole(['auditor', 'compliance_officer']);
  
  return (
    <nav>
      {isAdmin && <Link to="/settings/secrets/providers">Providers</Link>}
      {canAudit && <Link to="/settings/secrets/audit">Audit Log</Link>}
    </nav>
  );
}
```

## Next Steps

### Backend Integration
1. ⬜ Implement Zanzibar permission service in rustcare-engine
2. ⬜ Create PostgreSQL schema for permission tuples
3. ⬜ Build permission check API endpoints
4. ⬜ Integrate secrets-service crate with permission checks
5. ⬜ Add audit logging to database

### Frontend Enhancements
1. ⬜ Real-time permission updates via WebSocket
2. ⬜ Permission caching with TTL
3. ⬜ Bulk operations with permission checks
4. ⬜ Permission denial reasons (e.g., "Need secret_manager role")
5. ⬜ Admin UI for role assignment

### Additional Features
1. ⬜ Time-based permissions (temporary access)
2. ⬜ IP-based restrictions
3. ⬜ MFA requirement for sensitive operations
4. ⬜ Approval workflows for secret creation
5. ⬜ Secret sharing with expiration

## Testing

### Permission Tests
```typescript
describe('Permission System', () => {
  it('system_admin has all permissions', () => {
    const user = { userId: '1', roles: ['system_admin'] };
    expect(hasPermission(user, { resource: 'secret', action: 'delete' })).toBe(true);
  });
  
  it('secret_viewer cannot delete', () => {
    const user = { userId: '2', roles: ['secret_viewer'] };
    expect(hasPermission(user, { resource: 'secret', action: 'delete' })).toBe(false);
  });
});
```

## Documentation

- 📚 [Zanzibar Paper](https://research.google/pubs/pub48190/) - Original Google design
- 📚 [RBAC Best Practices](https://csrc.nist.gov/projects/role-based-access-control)
- 📚 [HIPAA Audit Requirements](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
