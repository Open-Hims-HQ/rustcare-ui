# Security Configuration

## Quick Toggle - Enable/Disable Security Features

Edit `/app/lib/security-config.ts` to quickly enable or disable security features:

```typescript
export const SecurityConfig = {
  ENABLE_AUTH: false,           // ← Set to true to require login
  ENABLE_PERMISSIONS: false,    // ← Set to true to enforce role permissions
  ENABLE_CSRF: false,           // ← Set to true to validate CSRF tokens
  ENABLE_RATE_LIMIT: false,     // ← Set to true to enable rate limiting
  ENABLE_AUDIT_LOG: false,      // ← Set to true to log all actions
}
```

## Security Features

### 1. Authentication (`ENABLE_AUTH`)
- **When disabled**: All requests use a mock admin user with full permissions
- **When enabled**: Users must log in, session management is enforced
- **Mock user**: Has roles: `system_admin`, `security_admin`, `secret_manager`

### 2. Authorization (`ENABLE_PERMISSIONS`)
- **When disabled**: All users have access to all features
- **When enabled**: Zanzibar permission checks enforce RBAC/ABAC
- **Affects**: Button visibility, menu items, API actions

### 3. CSRF Protection (`ENABLE_CSRF`)
- **When disabled**: No CSRF token validation on forms
- **When enabled**: All POST/PUT/DELETE requests require valid CSRF token

### 4. Rate Limiting (`ENABLE_RATE_LIMIT`)
- **When disabled**: Unlimited requests allowed
- **When enabled**: Max 100 requests per minute per IP address

### 5. Audit Logging (`ENABLE_AUDIT_LOG`)
- **When disabled**: Actions are not logged (reduces console noise)
- **When enabled**: All secret access/modifications logged for HIPAA compliance

## Development Workflow

### Local Development (Recommended Settings)
```typescript
ENABLE_AUTH: false         // No login required
ENABLE_PERMISSIONS: false  // Full access to all features
ENABLE_CSRF: false         // No CSRF validation
ENABLE_RATE_LIMIT: false   // Unlimited requests
ENABLE_AUDIT_LOG: false    // Less console noise
```

### Testing Security
```typescript
ENABLE_AUTH: true          // Test login flow
ENABLE_PERMISSIONS: true   // Test role-based access
ENABLE_CSRF: true          // Test CSRF protection
ENABLE_RATE_LIMIT: false   // Don't limit during tests
ENABLE_AUDIT_LOG: true     // Verify audit logs
```

### Production (Auto-enforced)
**All security features are automatically enabled in production**, regardless of config values.

```typescript
// Production always uses:
ENABLE_AUTH: true
ENABLE_PERMISSIONS: true
ENABLE_CSRF: true
ENABLE_RATE_LIMIT: true
ENABLE_AUDIT_LOG: true
```

## Mock User (Development Only)

When `ENABLE_AUTH: false`, this user is automatically logged in:

```typescript
{
  userId: 'dev-user-123',
  email: 'dev@example.com',
  name: 'Development User',
  roles: ['system_admin', 'security_admin', 'secret_manager'],
  organizationId: 'dev-org-123'
}
```

## Usage in Code

All routes automatically respect these settings via `validateRequest()`:

```typescript
// In a loader
export async function loader({ request }: LoaderFunctionArgs) {
  // This respects SecurityConfig settings
  const user = await validateRequest(request, {
    requireAuth: true,
    requirePermission: { resource: 'secret', action: 'list' },
  });
  
  return json({ secrets, user });
}
```

## Environment-Based Behavior

The system automatically detects the environment:

| Environment | Auth | Permissions | CSRF | Rate Limit | Audit |
|-------------|------|-------------|------|------------|-------|
| **Production** | ✅ Always | ✅ Always | ✅ Always | ✅ Always | ✅ Always |
| **Development** | ⚙️ Config | ⚙️ Config | ⚙️ Config | ⚙️ Config | ⚙️ Config |

## Security Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Implement real session management in `getUserSession()`
- [ ] Connect Zanzibar permission service
- [ ] Set up audit log database
- [ ] Configure CSRF token generation
- [ ] Set up SSL/TLS certificates
- [ ] Review rate limit thresholds

## Troubleshooting

### "Access Denied" in Development
- Check `ENABLE_AUTH` and `ENABLE_PERMISSIONS` in `security-config.ts`
- Verify mock user has required roles

### CSRF Errors
- Set `ENABLE_CSRF: false` during development
- Ensure CSRF tokens are generated in production

### Rate Limit Errors
- Set `ENABLE_RATE_LIMIT: false` during development
- Adjust limits in `SecurityConfig.RATE_LIMIT`

## Related Files

- `/app/lib/security-config.ts` - Main configuration file
- `/app/lib/security.server.ts` - Server-side security enforcement
- `/app/lib/permissions.ts` - Permission definitions
- `/app/hooks/usePermissions.tsx` - Client-side permission checks
- `/app/components/PermissionGuard.tsx` - Permission-based UI components
