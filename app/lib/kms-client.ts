/**
 * KMS (Key Management Service) Client
 * 
 * Provides cryptographic operations following enterprise KMS patterns
 */

import { 
  API_BASE_URL, 
  DEFAULT_HEADERS,
  REQUEST_TIMEOUT,
} from "~/constants/api";

export interface GenerateDataKeyRequest {
  kek_id: string;
  key_spec: string;
  context?: Record<string, string>;
}

export interface GenerateDataKeyResponse {
  encrypted_dek: string;
  key_id: string;
  request_id: string;
}

export interface DecryptDataKeyRequest {
  encrypted_dek: string;
  context?: Record<string, string>;
}

export interface DecryptDataKeyResponse {
  key_id: string;
  request_id: string;
  success: boolean;
}

export interface EncryptRequest {
  key_id: string;
  plaintext: string;
  context?: Record<string, string>;
}

export interface EncryptResponse {
  ciphertext: string;
  key_id: string;
  request_id: string;
}

export interface DecryptRequest {
  ciphertext: string;
  context?: Record<string, string>;
}

export interface DecryptResponse {
  plaintext: string;
  key_id: string;
  request_id: string;
}

export interface KeyMetadata {
  key_id: string;
  alias?: string;
  created_at: string;
  state: string;
  usage: string;
  algorithm: string;
  origin: string;
  last_rotated?: string;
  next_rotation?: string;
  description?: string;
  tags: Record<string, string>;
}

export interface CreateKeyRequest {
  description: string;
  key_spec: string;
  key_usage: string;
  tags?: Record<string, string>;
}

export interface KmsTestRequest {
  key_id: string;
  operations?: string[];
}

export interface TestResult {
  success: boolean;
  message: string;
  duration_ms: number;
}

export interface KmsTestResponse {
  success: boolean;
  results: Record<string, TestResult>;
  message: string;
  request_id: string;
}

/**
 * Get CSRF token from meta tag (server-generated)
 */
function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag?.getAttribute('content') || null;
}

/**
 * Secure API fetch with timeout and CSRF protection
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const method = options?.method || 'GET';
  const csrfToken = getCSRFToken();

  // Build headers
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...(options?.headers as Record<string, string> || {}),
  };

  // Add CSRF token for state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  // Create timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method,
      headers,
      credentials: 'include', // Send HttpOnly cookies (session)
      signal: options?.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Handle service unavailable (KMS not configured)
      if (response.status === 503) {
        throw new Error('KMS service is not available. Please configure KMS_ENABLED=true on the server.');
      }

      // Handle other errors
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }

      throw new Error(errorMessage);
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return undefined as T;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
    }

    throw error;
  }
}

/**
 * KMS API endpoints
 */
const KMS_ENDPOINTS = {
  TEST: '/kms/test',
  GENERATE_DATA_KEY: '/kms/datakey/generate',
  DECRYPT_DATA_KEY: '/kms/datakey/decrypt',
  ENCRYPT: '/kms/encrypt',
  DECRYPT: '/kms/decrypt',
  RE_ENCRYPT: '/kms/re-encrypt',
  KEYS: '/kms/keys',
  KEY_BY_ID: (keyId: string) => `/kms/keys/${keyId}`,
  ENABLE_ROTATION: (keyId: string) => `/kms/keys/${keyId}/rotation/enable`,
  DISABLE_ROTATION: (keyId: string) => `/kms/keys/${keyId}/rotation/disable`,
  ROTATION_STATUS: (keyId: string) => `/kms/keys/${keyId}/rotation/status`,
  ROTATE_KEY: (keyId: string) => `/kms/keys/${keyId}/rotate`,
  ENABLE_KEY: (keyId: string) => `/kms/keys/${keyId}/enable`,
  DISABLE_KEY: (keyId: string) => `/kms/keys/${keyId}/disable`,
  SCHEDULE_DELETION: (keyId: string) => `/kms/keys/${keyId}/schedule-deletion`,
  CANCEL_DELETION: (keyId: string) => `/kms/keys/${keyId}/cancel-deletion`,
} as const;

/**
 * KMS API Client
 */
export const kmsApi = {
  /**
   * Test KMS integration end-to-end (all operations on backend)
   * 
   * Executes comprehensive tests:
   * - Generate and decrypt data keys
   * - Encrypt and decrypt data
   * - Verify data integrity
   * 
   * Returns simple success/failure result.
   */
  testIntegration: (
    keyId: string,
    operations?: string[]
  ): Promise<KmsTestResponse> =>
    apiFetch<KmsTestResponse>(KMS_ENDPOINTS.TEST, {
      method: 'POST',
      body: JSON.stringify({
        key_id: keyId,
        operations: operations || [],
      }),
    }),

  /**
   * Generate a Data Encryption Key (DEK)
   * 
   * Returns an encrypted DEK for envelope encryption pattern.
   * Use the plaintext DEK immediately, then discard it.
   * Store the encrypted DEK alongside your encrypted data.
   */
  generateDataKey: (
    kekId: string,
    keySpec: string = 'AES_256',
    context?: Record<string, string>
  ): Promise<GenerateDataKeyResponse> =>
    apiFetch<GenerateDataKeyResponse>(KMS_ENDPOINTS.GENERATE_DATA_KEY, {
      method: 'POST',
      body: JSON.stringify({
        kek_id: kekId,
        key_spec: keySpec,
        context: context || {},
      }),
    }),

  /**
   * Decrypt a Data Encryption Key
   * 
   * Decrypt an encrypted DEK to recover plaintext for data decryption.
   */
  decryptDataKey: (
    encryptedDek: string,
    context?: Record<string, string>
  ): Promise<DecryptDataKeyResponse> =>
    apiFetch<DecryptDataKeyResponse>(KMS_ENDPOINTS.DECRYPT_DATA_KEY, {
      method: 'POST',
      body: JSON.stringify({
        encrypted_dek: encryptedDek,
        context: context || {},
      }),
    }),

  /**
   * Encrypt data directly using KMS (for small data < 4KB)
   */
  encrypt: (
    keyId: string,
    plaintext: string,
    context?: Record<string, string>
  ): Promise<EncryptResponse> =>
    apiFetch<EncryptResponse>(KMS_ENDPOINTS.ENCRYPT, {
      method: 'POST',
      body: JSON.stringify({
        key_id: keyId,
        plaintext,
        context: context || {},
      }),
    }),

  /**
   * Decrypt data encrypted with KMS
   */
  decrypt: (
    ciphertext: string,
    context?: Record<string, string>
  ): Promise<DecryptResponse> =>
    apiFetch<DecryptResponse>(KMS_ENDPOINTS.DECRYPT, {
      method: 'POST',
      body: JSON.stringify({
        ciphertext,
        context: context || {},
      }),
    }),

  /**
   * Create a new Key Encryption Key (KEK)
   */
  createKey: (
    description: string,
    keySpec: string = 'SYMMETRIC_DEFAULT',
    keyUsage: string = 'EncryptDecrypt',
    tags?: Record<string, string>
  ): Promise<KeyMetadata> =>
    apiFetch<KeyMetadata>(KMS_ENDPOINTS.KEYS, {
      method: 'POST',
      body: JSON.stringify({
        description,
        key_spec: keySpec,
        key_usage: keyUsage,
        tags: tags || {},
      }),
    }),

  /**
   * Get key metadata
   */
  describeKey: (keyId: string): Promise<KeyMetadata> =>
    apiFetch<KeyMetadata>(KMS_ENDPOINTS.KEY_BY_ID(keyId)),

  /**
   * List all keys
   */
  listKeys: (): Promise<{ keys: KeyMetadata[]; total: number }> =>
    apiFetch(KMS_ENDPOINTS.KEYS),

  /**
   * Enable automatic key rotation
   */
  enableKeyRotation: (keyId: string): Promise<{ success: boolean; message: string }> =>
    apiFetch(KMS_ENDPOINTS.ENABLE_ROTATION(keyId), { method: 'POST' }),

  /**
   * Disable automatic key rotation
   */
  disableKeyRotation: (keyId: string): Promise<{ success: boolean; message: string }> =>
    apiFetch(KMS_ENDPOINTS.DISABLE_ROTATION(keyId), { method: 'POST' }),

  /**
   * Manually rotate a key
   */
  rotateKey: (keyId: string): Promise<KeyMetadata> =>
    apiFetch<KeyMetadata>(KMS_ENDPOINTS.ROTATE_KEY(keyId), { method: 'POST' }),
};
