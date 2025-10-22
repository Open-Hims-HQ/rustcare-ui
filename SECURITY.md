# Security Architecture

## 🔒 Zero Trust + HIPAA Compliant Design

This application follows a **Zero Trust** security model where:
- Frontend is considered **untrusted**
- All security enforcement happens **server-side**
- PHI data is protected at every layer

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  UI Components (Untrusted Zone)                  │  │
│  │  - Display data                                  │  │
│  │  - Collect user input                            │  │
│  │  - Add CSRF token to requests                    │  │
│  │  - Handle auth errors (clear state on 401)      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTPS Only
┌─────────────────────────────────────────────────────────┐
│              Remix Server (Trusted Zone)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Loaders/Actions (Security Enforcement)          │  │
│  │  ✓ Session validation (HttpOnly cookies)        │  │
│  │  ✓ CSRF validation                               │  │
│  │  ✓ Rate limiting                                 │  │
│  │  ✓ Permission checks (Zanzibar)                 │  │
│  │  ✓ Input sanitization                            │  │
│  │  ✓ Audit logging                                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ Internal Network
┌─────────────────────────────────────────────────────────┐
│              Rust Backend (Data Layer)                   │
│  - Zanzibar authorization                                │
│  - Database access                                       │
│  - Business logic                                        │
└─────────────────────────────────────────────────────────┘
```

## Client-Side (Minimal)

**File**: `app/lib/api.ts`

### ✅ What Client Does:
1. Attach CSRF token from meta tag
2. Send HttpOnly cookies automatically (browser managed)
3. Handle timeout (30s)
4. Clear state on 401
5. Display errors

### ❌ What Client DOESN'T Do:
- ❌ Store tokens (no localStorage for auth tokens)
- ❌ Validate permissions
- ❌ Rate limiting
- ❌ Request signing
- ❌ Audit logging
- ❌ Session management

```typescript
// Simple, secure client fetch
const data = await apiFetch('/permissions/resources');
```

## Server-Side (All Security)

**File**: `app/lib/security.server.ts`

### 🛡️ Security Features:

#### 1. Session Management
- **HttpOnly cookies** (not accessible to JavaScript)
- **Secure flag** (HTTPS only in production)
- **SameSite=Strict** (CSRF protection)
- **8-hour timeout** (configurable)

```typescript
// In loader/action
const user = await requireUser(request);
```

#### 2. CSRF Protection
- Server generates token on each page load
- Token stored in:
  - **Cookie** (HttpOnly, server-readable)
  - **Meta tag** (client-readable)
- Both must match for state-changing requests

```typescript
// Automatic validation
await validateRequest(request);
```

#### 3. Rate Limiting
- **100 requests per minute** per IP
- Enforced server-side
- Cannot be bypassed

```typescript
if (!checkRateLimit(request)) {
  throw json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

#### 4. Permission Checks (Zanzibar)
- Every protected action checks permissions
- Integrated with Google Zanzibar
- Cached for performance

```typescript
// Require specific permission
await requirePermission(request, 'patient_records', 'read');
```

#### 5. Audit Logging (HIPAA)
- **All actions logged**:
  - Who (user ID)
  - What (action)
  - When (timestamp)
  - Where (IP, user agent)
  - Why (success/failure + details)

```typescript
await logAudit(request, {
  userId: user.userId,
  action: 'view_patient',
  resource: 'patient',
  resourceId: patientId,
  success: true,
});
```

#### 6. Input Sanitization
- Remove null bytes
- Strip control characters
- Prevent injection attacks

```typescript
const cleanData = sanitizeInput(formData);
```

## Usage in Remix Routes

### Example: Protected Resource Page

```typescript
// app/routes/admin.resources.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { validateRequest, requirePermission, logAudit } from "~/lib/security.server";
import { resourcesApi } from "~/lib/api.server"; // Server-side API client

export async function loader({ request }: LoaderFunctionArgs) {
  // 1. Validate request + check permissions
  const user = await validateRequest(request, {
    requireAuth: true,
    requirePermission: { resource: 'resources', action: 'read' },
  });

  try {
    // 2. Fetch data from backend
    const resources = await resourcesApi.list();

    // 3. Log successful access
    await logAudit(request, {
      userId: user!.userId,
      action: 'list_resources',
      resource: 'resources',
      success: true,
    });

    // 4. Return data
    return json({ resources, user });

  } catch (error) {
    // 5. Log failure
    await logAudit(request, {
      userId: user!.userId,
      action: 'list_resources',
      resource: 'resources',
      success: false,
      details: { error: error.message },
    });

    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  // 1. Validate + check permissions
  const user = await validateRequest(request, {
    requireAuth: true,
    requirePermission: { resource: 'resources', action: 'create' },
  });

  // 2. Parse and sanitize form data
  const formData = await request.formData();
  const data = sanitizeInput({
    name: formData.get('name'),
    resource_type: formData.get('resource_type'),
    // ...
  });

  // 3. Create resource
  const resource = await resourcesApi.create(data);

  // 4. Log action
  await logAudit(request, {
    userId: user!.userId,
    action: 'create_resource',
    resource: 'resources',
    resourceId: resource.id,
    success: true,
    details: { name: data.name },
  });

  return json({ resource });
}
```

## Security Checklist

### ✅ Authentication
- [x] HttpOnly cookies for sessions
- [x] Secure flag in production
- [x] SameSite=Strict
- [x] 8-hour session timeout
- [x] Automatic logout on expiry

### ✅ Authorization
- [x] Zanzibar integration
- [x] Permission checks in every loader/action
- [x] Role-based access control
- [x] PHI access restrictions

### ✅ CSRF Protection
- [x] Server-generated tokens
- [x] Double-submit cookie pattern
- [x] Validated on all state-changing requests

### ✅ Rate Limiting
- [x] 100 req/min per IP
- [x] Server-side enforcement
- [x] Automatic cleanup

### ✅ Audit Logging
- [x] All actions logged
- [x] HIPAA-compliant format
- [x] Immutable audit trail
- [x] Secure storage

### ✅ Data Protection
- [x] Input sanitization
- [x] Output encoding
- [x] HTTPS only (production)
- [x] No sensitive data in localStorage

### ✅ Error Handling
- [x] Generic error messages (no info leakage)
- [x] Detailed logs (server-side only)
- [x] Graceful degradation

## HIPAA Compliance

### Required Audit Events
All logged automatically:

- ✅ User authentication (login/logout)
- ✅ PHI access (read/view)
- ✅ PHI modification (create/update/delete)
- ✅ Permission changes
- ✅ Failed access attempts
- ✅ Session expiry
- ✅ CSRF failures

### Audit Log Format
```json
{
  "timestamp": 1729612800000,
  "userId": "user_123",
  "action": "view_patient",
  "resource": "patient",
  "resourceId": "patient_456",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "success": true,
  "details": { "fields": ["name", "dob"] }
}
```

## Production Deployment

### Environment Variables
```bash
# Required
NODE_ENV=production
SESSION_SECRET=<strong-random-secret>
API_BASE_URL=https://api.yourdomain.com/api/v1

# Optional
SESSION_TIMEOUT=28800000  # 8 hours in ms
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000   # 1 minute in ms
```

### Security Headers
Set these in your hosting provider:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

## Testing Security

### Test CSRF Protection
```bash
# Should fail (no CSRF token)
curl -X POST https://app.com/api/resource \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
```

### Test Rate Limiting
```bash
# Run 150 requests - last 50 should fail with 429
for i in {1..150}; do
  curl https://app.com/api/resource
done
```

### Test Session Timeout
```bash
# Login, wait 8 hours, make request - should redirect to login
```

## Incident Response

If security incident occurs:

1. **Immediately**: Revoke all sessions
   ```typescript
   await sessionStore.destroyAll();
   ```

2. **Review audit logs** for affected users/data
   ```typescript
   const events = await auditLog.query({ 
     startTime, 
     endTime, 
     userId 
   });
   ```

3. **Notify affected users** (HIPAA breach notification)

4. **Update security measures** and re-deploy

## Future Enhancements

- [ ] Multi-factor authentication (MFA)
- [ ] Biometric authentication
- [ ] Hardware security keys (WebAuthn)
- [ ] Anomaly detection (unusual access patterns)
- [ ] Encryption at rest for PHI
- [ ] Data loss prevention (DLP)
- [ ] Intrusion detection system (IDS)

## Questions?

Contact security team: security@openhims.org
