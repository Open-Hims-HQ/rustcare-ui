/**
 * Universal Enhanced Zustand Store Factory
 * Modular wrapper that can be extended with various features:
 * - Data masking (static, dynamic, deterministic, format-preserving)
 * - Redaction (full, partial, contextual, conditional, progressive)
 * - Anonymization (irreversible de-identification)
 * - Pseudonymization (reversible token replacement)
 * - Generalization (aggregation/bucketing)
 * - Data perturbation (noise injection)
 * - Audit logging
 * - Immutability
 * - Time-travel debugging
 * - Optimistic updates
 * - Undo/Redo
 */

import { create, StateCreator } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

// ============================================================================
// TYPES & ENUMS
// ============================================================================

export enum MaskingType {
  STATIC = 'static',               // Permanent replacement
  DYNAMIC = 'dynamic',             // On-the-fly based on permissions
  DETERMINISTIC = 'deterministic', // Same input → same output
  FORMAT_PRESERVING = 'format-preserving', // Keep format valid
  TOKENIZATION = 'tokenization',   // Reversible token
  ENCRYPTION = 'encryption',       // Encrypted data
}

export enum RedactionType {
  FULL = 'full',                   // Complete removal: "██████"
  PARTIAL = 'partial',             // Show part: "XXXX-3456"
  CONTEXTUAL = 'contextual',       // Based on role/permissions
  CONDITIONAL = 'conditional',     // Based on flags/consent
  PROGRESSIVE = 'progressive',     // More redaction at higher aggregation
}

export enum AnonymizationLevel {
  NONE = 'none',
  BASIC = 'basic',                 // Remove direct identifiers
  STRONG = 'strong',               // Remove quasi-identifiers
  COMPLETE = 'complete',           // Full de-identification
}

// Field configuration
export interface FieldConfig {
  // Masking
  maskingType?: MaskingType;
  maskPattern?: 'full' | 'partial' | 'email' | 'phone' | 'ssn' | 'credit-card' | 'custom';
  customMaskFn?: (value: any) => any;
  
  // Redaction
  redactionType?: RedactionType;
  redactionRule?: (context: any) => boolean; // When to redact
  
  // Anonymization
  anonymize?: boolean;
  anonymizationLevel?: AnonymizationLevel;
  generalizationBuckets?: any[]; // For bucketing (e.g., age ranges)
  
  // Pseudonymization
  pseudonymize?: boolean;
  tokenVault?: string; // Vault identifier
  
  // Perturbation
  perturbation?: {
    enabled: boolean;
    noiseRange?: number; // +/- range for numerical values
    preserveDistribution?: boolean;
  };
  
  // Access control
  requiredRoles?: string[];
  requiredPermissions?: string[];
  
  // Immutability
  immutable?: boolean;
  immutableAfterCreate?: boolean;
}

// Store configuration
export interface StoreConfig {
  name: string;
  version?: number;
  
  // Field-level configuration
  fields?: Record<string, FieldConfig>;
  
  // Feature flags
  features?: {
    auditLog?: boolean;
    immutability?: boolean;
    timeTravel?: boolean;
    undoRedo?: boolean;
    optimisticUpdates?: boolean;
    encryption?: boolean;
    persistence?: boolean;
    devtools?: boolean;
  };
  
  // Persistence config
  persistence?: {
    keys?: string[]; // Which keys to persist
    version?: number;
    migrate?: (persistedState: any, version: number) => any;
  };
  
  // User context
  contextProvider?: () => UserContext | null;
}

export interface UserContext {
  userId: string;
  roles: string[];
  permissions: string[];
  organizationId?: string;
  metadata?: Record<string, any>;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  before?: any;
  after?: any;
  metadata?: Record<string, any>;
}

// Base enhanced state
export interface EnhancedState {
  _meta: {
    config: StoreConfig;
    userContext: UserContext | null;
    auditLog: AuditEntry[];
    history: any[]; // For time-travel/undo-redo
    historyIndex: number;
  };
  
  // Core methods
  setUserContext: (context: UserContext) => void;
  addAuditEntry: (entry: Omit<AuditEntry, 'timestamp'>) => void;
  
  // Field operations
  maskField: (field: string, value: any, context?: any) => any;
  redactField: (field: string, value: any, context?: any) => any;
  anonymizeField: (field: string, value: any) => any;
  generalizeField: (field: string, value: any) => any;
  
  // Data operations
  processData: <T extends Record<string, any>>(data: T, operation?: 'mask' | 'redact' | 'anonymize') => T;
  canViewField: (field: string) => boolean;
  canModifyField: (field: string) => boolean;
  
  // Time-travel / Undo-Redo
  undo?: () => void;
  redo?: () => void;
  travelTo?: (index: number) => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Check permissions
function hasPermission(
  context: UserContext | null,
  config: FieldConfig
): boolean {
  if (!context) return false;
  
  const hasRole = !config.requiredRoles || 
    config.requiredRoles.some(role => context.roles.includes(role));
  
  const hasPerm = !config.requiredPermissions ||
    config.requiredPermissions.every(perm => context.permissions.includes(perm));
  
  return hasRole && hasPerm;
}

// Masking functions
function applyMask(value: any, pattern: string, maskChar = '•'): any {
  if (value === null || value === undefined) return value;
  const str = String(value);
  
  switch (pattern) {
    case 'full':
      return maskChar.repeat(str.length || 8);
    
    case 'partial':
      if (str.length <= 4) return maskChar.repeat(str.length);
      return str.slice(0, 2) + maskChar.repeat(str.length - 4) + str.slice(-2);
    
    case 'email':
      const emailMatch = str.match(/^(.)(.*?)(.?)@(.+)$/);
      if (!emailMatch) return maskChar.repeat(str.length);
      const [, first, middle, last, domain] = emailMatch;
      return `${first}${maskChar.repeat(middle.length)}${last || ''}@${domain}`;
    
    case 'phone':
      const digits = str.replace(/\D/g, '');
      if (digits.length >= 10) {
        return `(${maskChar.repeat(3)}) ${maskChar.repeat(3)}-${digits.slice(-4)}`;
      }
      return maskChar.repeat(Math.max(0, str.length - 4)) + str.slice(-4);
    
    case 'ssn':
      const ssnDigits = str.replace(/\D/g, '');
      if (ssnDigits.length === 9) {
        return `${maskChar.repeat(3)}-${maskChar.repeat(2)}-${ssnDigits.slice(-4)}`;
      }
      return maskChar.repeat(Math.max(0, str.length - 4)) + str.slice(-4);
    
    case 'credit-card':
      const cardDigits = str.replace(/\D/g, '');
      if (cardDigits.length === 16) {
        return `${maskChar.repeat(4)} ${maskChar.repeat(4)} ${maskChar.repeat(4)} ${cardDigits.slice(-4)}`;
      }
      return maskChar.repeat(Math.max(0, str.length - 4)) + str.slice(-4);
    
    default:
      return str;
  }
}

// Anonymization functions
function anonymizeValue(value: any, level: AnonymizationLevel): any {
  if (value === null || value === undefined) return value;
  
  switch (level) {
    case AnonymizationLevel.BASIC:
      // Remove direct identifiers
      return '[REMOVED]';
    
    case AnonymizationLevel.STRONG:
      // Remove quasi-identifiers
      return null;
    
    case AnonymizationLevel.COMPLETE:
      // Complete de-identification
      return null;
    
    default:
      return value;
  }
}

// Generalization (bucketing)
function generalizeValue(value: any, buckets: any[]): any {
  if (buckets && buckets.length > 0) {
    // Find the bucket this value falls into
    for (const bucket of buckets) {
      if (typeof bucket === 'object' && 'min' in bucket && 'max' in bucket) {
        if (value >= bucket.min && value <= bucket.max) {
          return bucket.label || `${bucket.min}–${bucket.max}`;
        }
      }
    }
  }
  return value;
}

// Perturbation (noise injection)
function perturbValue(value: any, range: number): any {
  if (typeof value !== 'number') return value;
  
  const noise = (Math.random() - 0.5) * 2 * range;
  return value + noise;
}

// ============================================================================
// ENHANCED STORE FACTORY
// ============================================================================

export function createEnhancedStore<T extends Record<string, any>>(
  config: StoreConfig,
  stateCreator: (set: any, get: any) => T
) {
  type StoreState = T & EnhancedState;
  
  const defaultFeatures = {
    auditLog: true,
    immutability: true,
    timeTravel: false,
    undoRedo: false,
    optimisticUpdates: false,
    encryption: false,
    persistence: true,
    devtools: true,
    ...config.features,
  };

  const creator: StateCreator<StoreState, [], []> = (set, get, api) => {
    const userState = stateCreator(set, get);
    
    const enhancedState: EnhancedState = {
      _meta: {
        config,
        userContext: config.contextProvider?.() || null,
        auditLog: [],
        history: [],
        historyIndex: -1,
      },
      
      setUserContext: (context) => {
        set((state: StoreState) => ({
          ...state,
          _meta: {
            ...state._meta,
            userContext: context,
          },
        }));
      },
      
      addAuditEntry: (entry) => {
        if (!defaultFeatures.auditLog) return;
        
        set((state: StoreState) => ({
          ...state,
          _meta: {
            ...state._meta,
            auditLog: [
              ...state._meta.auditLog,
              {
                ...entry,
                timestamp: new Date().toISOString(),
                userId: state._meta.userContext?.userId,
              },
            ].slice(-1000), // Keep last 1000
          },
        }));
      },
      
      maskField: (field, value, context) => {
        const fieldConfig = config.fields?.[field];
        if (!fieldConfig || !fieldConfig.maskPattern) return value;
        
        const userContext = (get() as StoreState)._meta.userContext;
        if (hasPermission(userContext, fieldConfig)) return value;
        
        if (fieldConfig.customMaskFn) {
          return fieldConfig.customMaskFn(value);
        }
        
        return applyMask(value, fieldConfig.maskPattern);
      },
      
      redactField: (field, value, context) => {
        const fieldConfig = config.fields?.[field];
        if (!fieldConfig || !fieldConfig.redactionType) return value;
        
        const userContext = (get() as StoreState)._meta.userContext;
        
        // Check redaction rule
        if (fieldConfig.redactionRule && !fieldConfig.redactionRule(context)) {
          return value;
        }
        
        if (!hasPermission(userContext, fieldConfig)) {
          switch (fieldConfig.redactionType) {
            case RedactionType.FULL:
              return '██████';
            case RedactionType.PARTIAL:
              return applyMask(value, 'partial');
            default:
              return value;
          }
        }
        
        return value;
      },
      
      anonymizeField: (field, value) => {
        const fieldConfig = config.fields?.[field];
        if (!fieldConfig || !fieldConfig.anonymize) return value;
        
        return anonymizeValue(value, fieldConfig.anonymizationLevel || AnonymizationLevel.BASIC);
      },
      
      generalizeField: (field, value) => {
        const fieldConfig = config.fields?.[field];
        if (!fieldConfig || !fieldConfig.generalizationBuckets) return value;
        
        return generalizeValue(value, fieldConfig.generalizationBuckets);
      },
      
      processData: (data, operation = 'mask') => {
        const result = { ...data };
        
        for (const key in result) {
          const fieldConfig = config.fields?.[key];
          if (!fieldConfig) continue;
          
          switch (operation) {
            case 'mask':
              result[key] = enhancedState.maskField(key, result[key]);
              break;
            case 'redact':
              result[key] = enhancedState.redactField(key, result[key]);
              break;
            case 'anonymize':
              result[key] = enhancedState.anonymizeField(key, result[key]);
              break;
          }
          
          // Apply generalization if configured
          if (fieldConfig.generalizationBuckets) {
            result[key] = enhancedState.generalizeField(key, result[key]);
          }
          
          // Apply perturbation if configured
          if (fieldConfig.perturbation?.enabled) {
            result[key] = perturbValue(result[key], fieldConfig.perturbation.noiseRange || 0.1);
          }
        }
        
        return result;
      },
      
      canViewField: (field) => {
        const fieldConfig = config.fields?.[field];
        if (!fieldConfig) return true;
        
        const userContext = (get() as StoreState)._meta.userContext;
        return hasPermission(userContext, fieldConfig);
      },
      
      canModifyField: (field) => {
        const fieldConfig = config.fields?.[field];
        if (!fieldConfig) return true;
        
        if (fieldConfig.immutable) return false;
        
        const userContext = (get() as StoreState)._meta.userContext;
        return hasPermission(userContext, fieldConfig);
      },
    };
    
    // Add undo/redo if enabled
    if (defaultFeatures.undoRedo) {
      enhancedState.undo = () => {
        const state = get() as StoreState;
        if (state._meta.historyIndex > 0) {
          const newIndex = state._meta.historyIndex - 1;
          const prevState = state._meta.history[newIndex];
          set({ ...prevState, _meta: { ...state._meta, historyIndex: newIndex } });
        }
      };
      
      enhancedState.redo = () => {
        const state = get() as StoreState;
        if (state._meta.historyIndex < state._meta.history.length - 1) {
          const newIndex = state._meta.historyIndex + 1;
          const nextState = state._meta.history[newIndex];
          set({ ...nextState, _meta: { ...state._meta, historyIndex: newIndex } });
        }
      };
      
      enhancedState.travelTo = (index: number) => {
        const state = get() as StoreState;
        if (index >= 0 && index < state._meta.history.length) {
          const targetState = state._meta.history[index];
          set({ ...targetState, _meta: { ...state._meta, historyIndex: index } });
        }
      };
    }
    
    return {
      ...userState,
      ...enhancedState,
    } as StoreState;
  };
  
  // Apply middleware (compose in reverse order: create -> devtools -> persist -> subscribe)
  if (defaultFeatures.persistence && config.persistence) {
    return create<StoreState>()(
      subscribeWithSelector(
        devtools(
          persist(creator, {
            name: `${config.name}-storage`,
            version: config.persistence.version,
            migrate: config.persistence.migrate,
            partialize: (state) => {
              if (!config.persistence?.keys) return {};
              
              const result: any = {};
              for (const key of config.persistence.keys) {
                if (key in state) {
                  result[key] = (state as any)[key];
                }
              }
              return result;
            },
          }),
          { name: config.name, enabled: defaultFeatures.devtools }
        )
      )
    );
  }
  
  // Without persistence
  if (defaultFeatures.devtools) {
    return create<StoreState>()(
      subscribeWithSelector(
        devtools(creator, { name: config.name })
      )
    );
  }
  
  return create<StoreState>()(creator);
}

// Export helper to create config
export function defineStoreConfig(config: StoreConfig): StoreConfig {
  return config;
}
