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
    CHECK: '/permissions/check',
  },

  // Organizations & Hospitals
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_BY_ID: (id: string) => `/organizations/${id}`,
  ORGANIZATION_USERS: (orgId: string) => `/organizations/${orgId}/users`,
  RESEND_CREDENTIALS: (userId: string) => `/users/${userId}/resend-credentials`,
  EMAIL_VERIFY: '/email/verify',
  HOSPITALS: '/hospitals',
  HOSPITAL_BY_ID: (id: string) => `/hospitals/${id}`,

  // Authentication & Authorization
  AUTH: {
    CHECK: '/auth/check',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/auth/refresh',
  },

  // Forms
  FORMS: {
    LIST: '/forms',
    CREATE: '/forms',
    BY_ID: (id: string) => `/forms/${id}`,
    BY_SLUG: (slug: string) => `/forms/slug/${slug}`,
    SUBMIT: '/forms/submit',
    SUBMISSIONS: (formId: string) => `/forms/${formId}/submissions`,
  },

  // Healthcare Data
  HEALTHCARE: {
    PATIENTS: '/organizations/:orgId/patients',
    PATIENT_BY_ID: (orgId: string, patientId: string) => `/organizations/${orgId}/patients/${patientId}`,
    MEDICAL_RECORDS: '/healthcare/medical-records',
    MEDICAL_RECORD_BY_ID: (recordId: string) => `/healthcare/medical-records/${recordId}`,
    MEDICAL_RECORD_AUDIT: (recordId: string) => `/healthcare/medical-records/${recordId}/audit`,
    PROVIDERS: '/healthcare/providers',
    PROVIDER_BY_ID: (id: string) => `/healthcare/providers/${id}`,
    APPOINTMENTS: '/healthcare/appointments',
    APPOINTMENT_BY_ID: (id: string) => `/healthcare/appointments/${id}`,
    VITAL_SIGNS: (patientId: string) => `/healthcare/patients/${patientId}/vital-signs`,
    SERVICE_TYPES: '/healthcare/service-types',
    SERVICE_TYPE_BY_ID: (id: string) => `/healthcare/service-types/${id}`,
  },

  // Pharmacy
  PHARMACY: {
    PHARMACIES: '/pharmacy/pharmacies',
    INVENTORY: '/pharmacy/inventory',
    PRESCRIPTIONS: '/pharmacy/prescriptions',
  },

  // Vendors
  VENDORS: {
    TYPES: '/vendors/types',
    LIST: '/vendors',
    INVENTORY: (vendorId: string) => `/vendors/${vendorId}/inventory`,
    SERVICES: (vendorId: string) => `/vendors/${vendorId}/services`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    BULK_MARK_READ: '/notifications/bulk-read',
    UNREAD_COUNT: '/notifications/unread/count',
    AUDIT_LOGS: (id: string) => `/notifications/${id}/audit-logs`,
  },

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
