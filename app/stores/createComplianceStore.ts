/**
 * Simplified Compliance Store Factory
 * Creates Zustand stores with built-in HIPAA/GDPR compliance features
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Re-export types from middleware
export { SensitivityLevel, type FieldVisibility, type RedactionConfig, type ImmutabilityConfig, type AuditLogEntry, type UserContext } from './middleware/compliance';

// Base compliance state that all stores will have
export interface BaseComplianceState {
  _compliance: {
    redactionConfig: {
      sensitiveFields: Record<string, string>;
      fieldMaskPatterns?: Record<string, 'partial' | 'full' | 'hash' | 'email' | 'phone' | 'ssn' | 'credit-card'>;
      maskChar: string;
    };
    immutabilityConfig: {
      immutableFields: string[];
      lockedRecords: Set<string>;
    };
    userContext: {
      userId: string;
      roles: string[];
      permissions: string[];
    } | null;
    auditLog: Array<{
      timestamp: string;
      action: string;
      userId?: string;
      entityId?: string;
      changes?: any;
    }>;
  };
  
  // Compliance actions
  setUserContext: (context: { userId: string; roles: string[]; permissions: string[] }) => void;
  addAuditLog: (entry: { action: string; entityId?: string; changes?: any }) => void;
  canModifyField: (field: string) => boolean;
  canViewField: (field: string) => boolean;
  redactSensitiveData: <T extends Record<string, any>>(data: T) => T;
  maskField: (field: string, value: any) => any;
}

/**
 * Create a compliance-ready Zustand store
 * @param storeName - Name for devtools
 * @param stateCreator - Your store state and actions
 * @param options - Configuration options
 */
export function createComplianceStore<T extends Record<string, any>>(
  storeName: string,
  stateCreator: (set: any, get: any) => T,
  options: {
    persistKeys?: string[];
    sensitiveFields?: Record<string, string>; // field -> sensitivity level
    fieldMaskPatterns?: Record<string, 'partial' | 'full' | 'hash' | 'email' | 'phone' | 'ssn' | 'credit-card'>;
    immutableFields?: string[];
  } = {}
) {
  const {
    persistKeys = [],
    sensitiveFields = {},
    fieldMaskPatterns = {},
    immutableFields = ['id', 'created_at', 'created_by'],
  } = options;

  type StoreState = T & BaseComplianceState;

  return create<StoreState>()(
    devtools(
      persist(
        (set, get) => {
          // Create base state
          const userState = stateCreator(set, get);

          // Add compliance state and methods
          const complianceState: BaseComplianceState = {
            _compliance: {
              redactionConfig: {
                sensitiveFields,
                fieldMaskPatterns,
                maskChar: '•',
              },
              immutabilityConfig: {
                immutableFields,
                lockedRecords: new Set(),
              },
              userContext: null,
              auditLog: [],
            },

            setUserContext: (context) => {
              set((state: StoreState) => ({
                ...state,
                _compliance: {
                  ...state._compliance,
                  userContext: context,
                },
              }) as StoreState);
            },

            addAuditLog: (entry) => {
              set((state: StoreState) => ({
                ...state,
                _compliance: {
                  ...state._compliance,
                  auditLog: [
                    ...state._compliance.auditLog,
                    {
                      ...entry,
                      timestamp: new Date().toISOString(),
                      userId: state._compliance.userContext?.userId,
                    },
                  ].slice(-1000), // Keep last 1000 entries
                },
              }) as StoreState);
            },

            canModifyField: (field: string) => {
              const state = get() as StoreState;
              return !state._compliance.immutabilityConfig.immutableFields.includes(field);
            },

            canViewField: (field: string) => {
              const state = get() as StoreState;
              const sensitivity = state._compliance.redactionConfig.sensitiveFields[field];
              const userContext = state._compliance.userContext;

              if (!sensitivity) return true;
              if (!userContext) return false;

              // Check if user has required permissions
              if (sensitivity === 'phi' && !userContext.permissions.includes('view_phi')) {
                return false;
              }
              if (sensitivity === 'pii' && !userContext.permissions.includes('view_pii')) {
                return false;
              }

              return true;
            },

            redactSensitiveData: <T extends Record<string, any>>(data: T): T => {
              const state = get() as StoreState;
              const result = { ...data };

              for (const key in result) {
                const sensitivity = state._compliance.redactionConfig.sensitiveFields[key];
                
                if (sensitivity && !complianceState.canViewField(key)) {
                  result[key] = complianceState.maskField(key, result[key]);
                }
              }

              return result;
            },

            maskField: (field: string, value: any): any => {
              const state = get() as StoreState;
              const maskPattern = state._compliance.redactionConfig.fieldMaskPatterns?.[field] || 'full';
              const maskChar = state._compliance.redactionConfig.maskChar;
              
              if (value === null || value === undefined) return value;
              const str = String(value);
              
              switch (maskPattern) {
                case 'email':
                  const emailMatch = str.match(/^(.)(.*?)(.?)@(.+)$/);
                  if (!emailMatch) return maskChar.repeat(str.length);
                  const [, first, middle, last, domain] = emailMatch;
                  const maskedLocal = first + maskChar.repeat(middle.length) + (last || '');
                  return `${maskedLocal}@${domain}`;
                
                case 'phone':
                  const digits = str.replace(/\D/g, '');
                  if (digits.length === 10) {
                    return `(${maskChar.repeat(3)}) ${maskChar.repeat(3)}-${digits.slice(-4)}`;
                  } else if (digits.length === 11) {
                    return `+${digits[0]} (${maskChar.repeat(3)}) ${maskChar.repeat(3)}-${digits.slice(-4)}`;
                  }
                  return maskChar.repeat(str.length - 4) + str.slice(-4);
                
                case 'ssn':
                  const ssnDigits = str.replace(/\D/g, '');
                  if (ssnDigits.length === 9) {
                    return `${maskChar.repeat(3)}-${maskChar.repeat(2)}-${ssnDigits.slice(-4)}`;
                  }
                  return maskChar.repeat(str.length - 4) + str.slice(-4);
                
                case 'credit-card':
                  const cardDigits = str.replace(/\D/g, '');
                  if (cardDigits.length === 16) {
                    const last4 = cardDigits.slice(-4);
                    return `${maskChar.repeat(4)} ${maskChar.repeat(4)} ${maskChar.repeat(4)} ${last4}`;
                  }
                  return maskChar.repeat(str.length - 4) + str.slice(-4);
                
                case 'partial':
                  if (str.length <= 4) return maskChar.repeat(str.length);
                  return str.slice(0, 2) + maskChar.repeat(str.length - 4) + str.slice(-2);
                
                case 'hash':
                  return `[REDACTED-${str.length}]`;
                
                case 'full':
                default:
                  return maskChar.repeat(str.length || 8);
              }
            },
          };

          return {
            ...userState,
            ...complianceState,
          } as StoreState;
        },
        {
          name: `${storeName}-storage`,
          partialize: (state) => {
            if (persistKeys.length === 0) return {};
            
            const result: any = {};
            for (const key of persistKeys) {
              if (key in state) {
                result[key] = (state as any)[key];
              }
            }
            return result;
          },
        }
      ),
      { name: storeName }
    )
  );
}
