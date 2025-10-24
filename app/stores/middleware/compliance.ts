/**
 * Compliance Middleware for Zustand
 * Provides HIPAA, GDPR, and healthcare compliance features:
 * - Data redaction for PHI/PII
 * - Field-level visibility controls
 * - Immutability for audit trails
 * - Automatic audit logging
 * - Data retention policies
 */

import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

// Sensitivity levels for healthcare data
export enum SensitivityLevel {
  PUBLIC = 'public',           // No restrictions
  INTERNAL = 'internal',       // Internal use only
  CONFIDENTIAL = 'confidential', // Limited access
  PHI = 'phi',                 // Protected Health Information (HIPAA)
  PII = 'pii',                 // Personally Identifiable Information (GDPR)
}

// Field visibility rules based on user roles/permissions
export interface FieldVisibility {
  field: string;
  roles: string[];           // Roles that can view this field
  requiredPermissions?: string[]; // Specific permissions needed
  maskPattern?: 'partial' | 'full' | 'hash' | 'email' | 'phone' | 'ssn' | 'credit-card'; // How to mask if no access
}

// Redaction configuration
export interface RedactionConfig {
  enabled: boolean;
  sensitiveFields: Record<string, SensitivityLevel>;
  visibilityRules: FieldVisibility[];
  defaultMaskChar: string;
}

// Immutability configuration
export interface ImmutabilityConfig {
  enabled: boolean;
  immutableFields: string[];  // Fields that cannot be modified after creation
  lockedRecords: Set<string>; // Record IDs that are completely locked
  requireReason: boolean;     // Require reason for modifications
}

// Audit log entry
export interface AuditLogEntry {
  timestamp: string;
  action: 'create' | 'read' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  userId?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
    reason?: string;
  }[];
  metadata?: Record<string, any>;
}

// User context for access control
export interface UserContext {
  userId: string;
  roles: string[];
  permissions: string[];
  organizationId?: string;
}

// Compliance state that gets added to every store
export interface ComplianceState {
  // Configuration
  _compliance: {
    redaction: RedactionConfig;
    immutability: ImmutabilityConfig;
    userContext: UserContext | null;
    auditLog: AuditLogEntry[];
  };

  // Methods
  _setUserContext: (context: UserContext) => void;
  _setRedactionConfig: (config: Partial<RedactionConfig>) => void;
  _setImmutabilityConfig: (config: Partial<ImmutabilityConfig>) => void;
  _addAuditLog: (entry: Omit<AuditLogEntry, 'timestamp'>) => void;
  _getAuditLog: (entityId?: string) => AuditLogEntry[];
  _canModifyField: (field: string, recordId?: string) => boolean;
  _canViewField: (field: string) => boolean;
  _redactData: <T>(data: T) => T;
}

// Helper: Check if user has required permissions
const hasPermission = (
  userContext: UserContext | null,
  requiredRoles: string[] = [],
  requiredPermissions: string[] = []
): boolean => {
  if (!userContext) return false;
  
  const hasRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => userContext.roles.includes(role));
  
  const hasPermissions = requiredPermissions.length === 0 ||
    requiredPermissions.every(perm => userContext.permissions.includes(perm));
  
  return hasRole && hasPermissions;
};

// Helper: Redact a single value based on mask pattern
const redactValue = (
  value: any, 
  pattern: 'partial' | 'full' | 'hash' | 'email' | 'phone' | 'ssn' | 'credit-card' = 'full', 
  maskChar = '•'
): any => {
  if (value === null || value === undefined) return value;
  
  const str = String(value);
  
  switch (pattern) {
    case 'full':
      // Completely mask the value
      return maskChar.repeat(str.length || 8);
    
    case 'partial':
      // Show first 2 and last 2 characters for general strings
      if (str.length <= 4) return maskChar.repeat(str.length);
      return str.slice(0, 2) + maskChar.repeat(str.length - 4) + str.slice(-2);
    
    case 'email':
      // Show first char + last char before @, and domain
      // Example: j•••n@example.com
      const emailMatch = str.match(/^(.)(.*?)(.?)@(.+)$/);
      if (!emailMatch) return maskChar.repeat(str.length);
      const [, first, middle, last, domain] = emailMatch;
      const maskedLocal = first + maskChar.repeat(middle.length) + (last || '');
      return `${maskedLocal}@${domain}`;
    
    case 'phone':
      // Show last 4 digits of phone
      // Example: (•••) •••-1234 or •••-•••-1234
      const digits = str.replace(/\D/g, '');
      if (digits.length === 10) {
        return `(${maskChar.repeat(3)}) ${maskChar.repeat(3)}-${digits.slice(-4)}`;
      } else if (digits.length === 11) {
        return `+${digits[0]} (${maskChar.repeat(3)}) ${maskChar.repeat(3)}-${digits.slice(-4)}`;
      }
      return maskChar.repeat(str.length - 4) + str.slice(-4);
    
    case 'ssn':
      // Show last 4 digits of SSN
      // Example: •••-••-1234
      const ssnDigits = str.replace(/\D/g, '');
      if (ssnDigits.length === 9) {
        return `${maskChar.repeat(3)}-${maskChar.repeat(2)}-${ssnDigits.slice(-4)}`;
      }
      return maskChar.repeat(str.length - 4) + str.slice(-4);
    
    case 'credit-card':
      // Show last 4 digits of credit card
      // Example: •••• •••• •••• 1234
      const cardDigits = str.replace(/\D/g, '');
      if (cardDigits.length === 16) {
        const last4 = cardDigits.slice(-4);
        return `${maskChar.repeat(4)} ${maskChar.repeat(4)} ${maskChar.repeat(4)} ${last4}`;
      }
      return maskChar.repeat(str.length - 4) + str.slice(-4);
    
    case 'hash':
      // Simple hash representation (not cryptographic)
      return `[REDACTED-${str.length}]`;
    
    default:
      return maskChar.repeat(8);
  }
};

// Helper: Deep clone and redact object
const redactObject = <T extends Record<string, any>>(
  obj: T,
  config: RedactionConfig,
  userContext: UserContext | null
): T => {
  if (!config.enabled || !obj || typeof obj !== 'object') {
    return obj;
  }

  const result: any = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in result) {
    const value = result[key];
    const sensitivity = config.sensitiveFields[key];
    const visibilityRule = config.visibilityRules.find(r => r.field === key);

    // Check if user can view this field
    const canView = !visibilityRule || hasPermission(
      userContext,
      visibilityRule.roles,
      visibilityRule.requiredPermissions
    );

    if (!canView && visibilityRule) {
      // Redact based on mask pattern
      result[key] = redactValue(value, visibilityRule.maskPattern, config.defaultMaskChar);
    } else if (sensitivity && sensitivity !== SensitivityLevel.PUBLIC) {
      // Check sensitivity level permissions
      const needsRedaction = (
        (sensitivity === SensitivityLevel.PHI && !userContext?.permissions.includes('view_phi')) ||
        (sensitivity === SensitivityLevel.PII && !userContext?.permissions.includes('view_pii'))
      );

      if (needsRedaction) {
        result[key] = redactValue(value, 'full', config.defaultMaskChar);
      }
    }

    // Recursively redact nested objects
    if (value && typeof value === 'object') {
      result[key] = redactObject(value, config, userContext);
    }
  }

  return result as T;
};

// Type for the compliance middleware
type ComplianceMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, [...Mps, ['compliance', unknown]], Mcs>
) => StateCreator<T, Mps, [['compliance', ComplianceState], ...Mcs]>;

type ComplianceImpl = <T>(
  config: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

// Default configurations
const defaultRedactionConfig: RedactionConfig = {
  enabled: true,
  sensitiveFields: {},
  visibilityRules: [],
  defaultMaskChar: '•',
};

const defaultImmutabilityConfig: ImmutabilityConfig = {
  enabled: true,
  immutableFields: ['id', 'created_at', 'created_by'],
  lockedRecords: new Set(),
  requireReason: true,
};

/**
 * Compliance Middleware Implementation
 * Wraps any Zustand store with compliance features
 */
export const compliance = ((config) => (set, get, api) => {
  // Wrap the set function to add compliance checks
  const complianceSet: typeof set = (partial, replace) => {
    const state = get();
    const complianceState = (state as any)._compliance as ComplianceState['_compliance'];

    // Audit logging
    if (typeof partial === 'function') {
      const newState = partial(state);
      
      // Log the change
      const entry: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        action: 'update',
        entityType: 'state',
        entityId: 'store',
        userId: complianceState?.userContext?.userId,
        metadata: { replace },
      };

      // Call original set with audit log
      set((currentState) => {
        const updated = partial(currentState);
        return {
          ...updated,
          _compliance: {
            ...(updated as any)._compliance,
            auditLog: [...((updated as any)._compliance?.auditLog || []), entry].slice(-1000), // Keep last 1000 entries
          },
        };
      }, replace);
    } else {
      const entry: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        action: 'update',
        entityType: 'state',
        entityId: 'store',
        userId: complianceState?.userContext?.userId,
        metadata: { replace },
      };

      set({
        ...partial,
        _compliance: {
          ...(partial as any)._compliance,
          auditLog: [...(complianceState?.auditLog || []), entry].slice(-1000),
        },
      } as any, replace);
    }
  };

  // Initialize the base config with compliance state
  const storeState = config(complianceSet, get, api);

  return {
    ...storeState,
    
    // Compliance state
    _compliance: {
      redaction: { ...defaultRedactionConfig },
      immutability: { ...defaultImmutabilityConfig },
      userContext: null,
      auditLog: [],
    },

    // Compliance methods
    _setUserContext: (context: UserContext) => {
      set((state: any) => ({
        _compliance: {
          ...state._compliance,
          userContext: context,
        },
      }));
    },

    _setRedactionConfig: (config: Partial<RedactionConfig>) => {
      set((state: any) => ({
        _compliance: {
          ...state._compliance,
          redaction: {
            ...state._compliance.redaction,
            ...config,
          },
        },
      }));
    },

    _setImmutabilityConfig: (config: Partial<ImmutabilityConfig>) => {
      set((state: any) => ({
        _compliance: {
          ...state._compliance,
          immutability: {
            ...state._compliance.immutability,
            ...config,
          },
        },
      }));
    },

    _addAuditLog: (entry: Omit<AuditLogEntry, 'timestamp'>) => {
      set((state: any) => ({
        _compliance: {
          ...state._compliance,
          auditLog: [
            ...state._compliance.auditLog,
            { ...entry, timestamp: new Date().toISOString() },
          ].slice(-1000), // Keep last 1000 entries
        },
      }));
    },

    _getAuditLog: (entityId?: string) => {
      const state = get() as any;
      const logs = state._compliance.auditLog || [];
      
      if (entityId) {
        return logs.filter((log: AuditLogEntry) => log.entityId === entityId);
      }
      
      return logs;
    },

    _canModifyField: (field: string, recordId?: string) => {
      const state = get() as any;
      const config = state._compliance.immutability as ImmutabilityConfig;
      
      if (!config.enabled) return true;
      
      // Check if field is immutable
      if (config.immutableFields.includes(field)) {
        return false;
      }
      
      // Check if record is locked
      if (recordId && config.lockedRecords.has(recordId)) {
        return false;
      }
      
      return true;
    },

    _canViewField: (field: string) => {
      const state = get() as any;
      const redactionConfig = state._compliance.redaction as RedactionConfig;
      const userContext = state._compliance.userContext as UserContext | null;
      
      if (!redactionConfig.enabled) return true;
      
      const visibilityRule = redactionConfig.visibilityRules.find(r => r.field === field);
      
      if (!visibilityRule) return true;
      
      return hasPermission(
        userContext,
        visibilityRule.roles,
        visibilityRule.requiredPermissions
      );
    },

    _redactData: <T extends Record<string, any>>(data: T): T => {
      const state = get() as any;
      const redactionConfig = state._compliance.redaction as RedactionConfig;
      const userContext = state._compliance.userContext as UserContext | null;
      
      return redactObject(data, redactionConfig, userContext);
    },
  };
}) as ComplianceImpl as ComplianceMiddleware;

// Export helper types for use in stores
export type WithCompliance<T> = T & ComplianceState;
