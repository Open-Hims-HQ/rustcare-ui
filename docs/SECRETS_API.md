# RustCare Secrets Service API Documentation

## Overview

The Secrets Service provides secure storage, retrieval, rotation, and management of sensitive credentials and configuration values. It supports multiple backend providers including HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, and more.

## Base URL

```
http://localhost:8081/api/v1/secrets
```

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### 1. List All Secrets

Get a list of all secret keys (values are not included).

**Endpoint:** `GET /api/v1/secrets`

**Response:**
```json
{
  "secrets": [
    "database/password",
    "api/jwt_secret",
    "smtp/credentials"
  ],
  "total": 3
}
```

---

### 2. Get Secret

Retrieve the current version of a secret.

**Endpoint:** `GET /api/v1/secrets/{key}`

**Parameters:**
- `key` (path): Secret key/name (e.g., `database/password`)

**Response:**
```json
{
  "key": "database/password",
  "value": "********",
  "version": "v1",
  "created_at": "2025-10-28T10:00:00Z",
  "updated_at": "2025-10-28T10:00:00Z",
  "expires_at": null,
  "rotation_enabled": true,
  "rotation_interval_days": 90,
  "tags": {
    "environment": "production",
    "service": "postgres"
  }
}
```

---

### 3. Create Secret

Store a new secret with optional rotation and expiration settings.

**Endpoint:** `POST /api/v1/secrets`

**Request Body:**
```json
{
  "key": "database/password",
  "value": "super_secure_password_123",
  "rotation_enabled": true,
  "rotation_interval_days": 90,
  "expires_at": "2026-10-28T10:00:00Z",
  "tags": {
    "environment": "production",
    "service": "postgres"
  }
}
```

**Response:** `201 Created`
```json
{
  "key": "database/password",
  "version": "v1",
  "created_at": "2025-10-28T10:00:00Z",
  "updated_at": "2025-10-28T10:00:00Z",
  "expires_at": "2026-10-28T10:00:00Z",
  "rotation_enabled": true,
  "rotation_interval_days": 90,
  "tags": {
    "environment": "production",
    "service": "postgres"
  }
}
```

---

### 4. Update Secret

Update the value and/or settings of an existing secret.

**Endpoint:** `PUT /api/v1/secrets/{key}`

**Parameters:**
- `key` (path): Secret key/name

**Request Body:**
```json
{
  "value": "new_super_secure_password_456",
  "rotation_enabled": true,
  "rotation_interval_days": 60,
  "expires_at": "2026-12-31T23:59:59Z",
  "tags": {
    "environment": "production",
    "service": "postgres",
    "updated_by": "admin"
  }
}
```

**Response:** `200 OK`
```json
{
  "key": "database/password",
  "version": "v2",
  "created_at": "2025-10-28T10:00:00Z",
  "updated_at": "2025-10-28T12:30:00Z",
  "expires_at": "2026-12-31T23:59:59Z",
  "rotation_enabled": true,
  "rotation_interval_days": 60,
  "tags": {
    "environment": "production",
    "service": "postgres",
    "updated_by": "admin"
  }
}
```

---

### 5. Delete Secret

Permanently remove a secret and all its versions.

**Endpoint:** `DELETE /api/v1/secrets/{key}`

**Parameters:**
- `key` (path): Secret key/name

**Response:** `204 No Content`

---

### 6. List Secret Versions

Get all available versions for a specific secret.

**Endpoint:** `GET /api/v1/secrets/{key}/versions`

**Parameters:**
- `key` (path): Secret key/name

**Response:**
```json
{
  "key": "database/password",
  "versions": ["v3", "v2", "v1"],
  "total": 3
}
```

---

### 7. Get Secret Version

Retrieve a specific historical version of a secret.

**Endpoint:** `GET /api/v1/secrets/{key}/versions/{version}`

**Parameters:**
- `key` (path): Secret key/name
- `version` (path): Version identifier (e.g., `v1`)

**Response:**
```json
{
  "key": "database/password",
  "value": "********",
  "version": "v1",
  "created_at": "2025-10-28T10:00:00Z",
  "updated_at": "2025-10-28T10:00:00Z",
  "expires_at": null,
  "rotation_enabled": true,
  "rotation_interval_days": 90,
  "tags": {
    "environment": "production"
  }
}
```

---

### 8. Rotate Secret

Generate a new value for the secret and create a new version.

**Endpoint:** `POST /api/v1/secrets/{key}/rotate`

**Parameters:**
- `key` (path): Secret key/name

**Response:**
```json
{
  "key": "database/password",
  "new_version": "v4",
  "rotated_at": "2025-10-28T15:00:00Z"
}
```

---

### 9. Health Check

Verify connectivity to all configured secret providers.

**Endpoint:** `GET /api/v1/secrets/health`

**Response:**
```json
{
  "healthy": true,
  "message": "All secret providers are healthy",
  "latency_ms": 25,
  "last_check": "2025-10-28T15:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Secret key cannot be empty"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Secret 'database/password' not found"
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "Secret 'database/password' already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to connect to secrets provider"
}
```

### 503 Service Unavailable
```json
{
  "error": "Service unavailable",
  "message": "Secrets service is temporarily unavailable"
}
```

---

## Usage Examples

### cURL Examples

#### List all secrets
```bash
curl -X GET http://localhost:8081/api/v1/secrets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create a new secret
```bash
curl -X POST http://localhost:8081/api/v1/secrets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "api/jwt_secret",
    "value": "my_super_secret_jwt_key",
    "rotation_enabled": true,
    "rotation_interval_days": 90,
    "tags": {
      "service": "auth",
      "environment": "production"
    }
  }'
```

#### Get a secret
```bash
curl -X GET http://localhost:8081/api/v1/secrets/api/jwt_secret \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Rotate a secret
```bash
curl -X POST http://localhost:8081/api/v1/secrets/api/jwt_secret/rotate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Delete a secret
```bash
curl -X DELETE http://localhost:8081/api/v1/secrets/api/jwt_secret \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### TypeScript/Fetch Examples

```typescript
// Base configuration
const API_BASE_URL = 'http://localhost:8081/api/v1';
const authToken = 'YOUR_JWT_TOKEN';

// List all secrets
async function listSecrets() {
  const response = await fetch(`${API_BASE_URL}/secrets`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  return await response.json();
}

// Create a secret
async function createSecret(key: string, value: string, options?: {
  rotation_enabled?: boolean;
  rotation_interval_days?: number;
  expires_at?: string;
  tags?: Record<string, string>;
}) {
  const response = await fetch(`${API_BASE_URL}/secrets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key,
      value,
      ...options
    })
  });
  return await response.json();
}

// Get a secret
async function getSecret(key: string) {
  const response = await fetch(`${API_BASE_URL}/secrets/${encodeURIComponent(key)}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  return await response.json();
}

// Rotate a secret
async function rotateSecret(key: string) {
  const response = await fetch(`${API_BASE_URL}/secrets/${encodeURIComponent(key)}/rotate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  return await response.json();
}
```

---

## Security Considerations

### Best Practices

1. **Never log secret values**: Always mask or redact secret values in logs
2. **Use HTTPS in production**: Never transmit secrets over unencrypted connections
3. **Implement rate limiting**: Prevent brute-force attacks on secret endpoints
4. **Enable audit logging**: Track all secret access and modifications
5. **Rotate secrets regularly**: Use automatic rotation for critical credentials
6. **Use least privilege**: Grant only necessary permissions to access secrets
7. **Encrypt at rest**: Ensure secrets are encrypted in the backend provider
8. **Set expiration dates**: Use time-limited secrets when possible

### HIPAA Compliance

The Secrets Service is designed with HIPAA compliance in mind:

- ✅ **Encryption**: All secrets encrypted in transit and at rest
- ✅ **Audit Trails**: Complete logging of all secret access
- ✅ **Access Controls**: Role-based permissions for secret management
- ✅ **Data Integrity**: Version control and rollback capabilities
- ✅ **Automatic Expiration**: Support for time-limited credentials

---

## Supported Providers

The Secrets Service supports multiple backend providers:

### HashiCorp Vault
- ✅ KV v1 and v2 secret engines
- ✅ Dynamic secret generation
- ✅ Lease management
- ✅ Transit encryption

### AWS Secrets Manager
- ✅ Automatic rotation
- ✅ Cross-region replication
- ✅ CloudWatch integration
- ✅ IAM policy support

### Azure Key Vault
- 🚧 Coming soon
- Key management
- Certificate storage
- RBAC integration

### Google Cloud Secret Manager
- 🚧 Coming soon
- Version management
- IAM integration
- Audit logging

### Kubernetes Secrets
- 🚧 Coming soon
- Native K8s integration
- Service account access
- ConfigMap compatibility

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **List operations**: 100 requests per minute
- **Get operations**: 1000 requests per minute
- **Create/Update operations**: 50 requests per minute
- **Delete operations**: 20 requests per minute
- **Rotate operations**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698501600
```

---

## Versioning

The Secrets API uses semantic versioning:

- **Current version**: v1
- **Base path**: `/api/v1/secrets`
- **Breaking changes**: Will increment major version (v2, v3, etc.)
- **Backward compatibility**: Maintained for at least one major version

---

## Support

For issues or questions:
- 📧 Email: support@rustcare.dev
- 📚 Documentation: https://docs.rustcare.dev
- 🐛 Bug Reports: https://github.com/rustcare/engine/issues

