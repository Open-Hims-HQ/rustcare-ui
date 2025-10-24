/**
 * Zustand Stores
 * Central export for all application state management
 */

// Store instances
export { usePermissionStore } from './usePermissionStore';
export { useOrganizationStore } from './useOrganizationStore';
export { useAuthStore } from './useAuthStore';
export { useResourceStore } from './useResourceStore';
export { useComplianceStore } from './useComplianceStore';

// Enhanced store factory (universal wrapper)
export { 
  createEnhancedStore, 
  defineStoreConfig,
  MaskingType,
  RedactionType,
  AnonymizationLevel,
} from './createEnhancedStore';
export type { 
  EnhancedState,
  StoreConfig,
  FieldConfig,
  UserContext,
  AuditEntry,
} from './createEnhancedStore';

// Legacy compliance store factory (for backward compatibility)
export { createComplianceStore } from './createComplianceStore';
export type { BaseComplianceState } from './createComplianceStore';

