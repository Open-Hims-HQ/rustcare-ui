/**
 * Security Configuration
 * Centralized control for authentication and authorization
 */

export const SecurityConfig = {
  /**
   * Enable/disable authentication checks globally
   * Set to false during development to bypass login requirements
   */
  ENABLE_AUTH: false,

  /**
   * Enable/disable authorization (permission) checks globally
   * Set to false during development to bypass permission checks
   */
  ENABLE_PERMISSIONS: false,

  /**
   * Enable/disable CSRF token validation
   * Set to false during development to bypass CSRF checks
   */
  ENABLE_CSRF: false,

  /**
   * Enable/disable rate limiting
   * Set to false during development to bypass rate limits
   */
  ENABLE_RATE_LIMIT: false,

  /**
   * Enable/disable audit logging
   * Set to false during development to reduce noise
   */
  ENABLE_AUDIT_LOG: false,

  /**
   * Mock user for development when auth is disabled
   * This user will be returned by validateRequest when ENABLE_AUTH is false
   */
  DEV_MOCK_USER: {
    userId: 'dev-user-123',
    email: 'dev@example.com',
    name: 'Development User',
    roles: ['system_admin', 'security_admin', 'secret_manager'] as string[],
    organizationId: 'dev-org-123',
    createdAt: Date.now(),
    lastActivity: Date.now(),
  },

  /**
   * Session timeout in milliseconds (8 hours)
   */
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000,

  /**
   * Rate limit configuration
   */
  RATE_LIMIT: {
    maxRequests: 100,
    timeWindow: 60000, // 1 minute
  },
} as const;

/**
 * Helper to check if running in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Helper to check if running in production mode
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Get effective security settings (respects environment)
 * In production, always enable security features regardless of config
 */
export const getSecurityConfig = () => {
  if (isProduction()) {
    return {
      ENABLE_AUTH: true,
      ENABLE_PERMISSIONS: true,
      ENABLE_CSRF: true,
      ENABLE_RATE_LIMIT: true,
      ENABLE_AUDIT_LOG: true,
    };
  }

  return {
    ENABLE_AUTH: SecurityConfig.ENABLE_AUTH,
    ENABLE_PERMISSIONS: SecurityConfig.ENABLE_PERMISSIONS,
    ENABLE_CSRF: SecurityConfig.ENABLE_CSRF,
    ENABLE_RATE_LIMIT: SecurityConfig.ENABLE_RATE_LIMIT,
    ENABLE_AUDIT_LOG: SecurityConfig.ENABLE_AUDIT_LOG,
  };
};
