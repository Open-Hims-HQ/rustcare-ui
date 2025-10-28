/**
 * API Constants
 * Central location for all API endpoints and configurations
 */

// Base API URL - can be overridden via environment variable
export const API_BASE_URL = typeof process !== 'undefined' && process.env?.API_BASE_URL 
  ? process.env.API_BASE_URL 
  : 'https://api.openhims.health/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Permission Management
  PERMISSIONS: {
    RESOURCES: '/permissions/resources',
    RESOURCE_BY_ID: (id: string) => `/permissions/resources/${id}`,
    GROUPS: '/permissions/groups',
    GROUP_BY_ID: (id: string) => `/permissions/groups/${id}`,
    ROLES: '/permissions/roles',
    ROLE_BY_ID: (id: string) => `/permissions/roles/${id}`,
    USER_PERMISSIONS: (userId: string) => `/permissions/users/${userId}`,
  },

  // Organizations & Hospitals
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_BY_ID: (id: string) => `/organizations/${id}`,
  HOSPITALS: '/hospitals',
  HOSPITAL_BY_ID: (id: string) => `/hospitals/${id}`,

  // Authentication & Authorization
  AUTH: {
    CHECK: '/auth/check',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Healthcare Data
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id: string) => `/patients/${id}`,
  ENCOUNTERS: '/encounters',
  ENCOUNTER_BY_ID: (id: string) => `/encounters/${id}`,

  // Audit & Compliance
  AUDIT: {
    LOGS: '/audit/logs',
    ACCESS_LOGS: '/audit/access',
  },

  // KMS (Key Management Service)
  KMS: {
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
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
} as const;

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;

// Request Timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Retry Configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
} as const;
