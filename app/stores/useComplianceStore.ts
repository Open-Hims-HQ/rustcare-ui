/**
 * Compliance Store with HIPAA/GDPR-ready features
 * Handles frameworks, rules, and regulatory requirements
 */

import { createComplianceStore } from './createComplianceStore';

// Types for compliance entities
export interface ComplianceFramework {
  id: string;
  name: string;
  code: string;
  version: string;
  description?: string;
  jurisdiction: string;
  effective_date: string;
  expiry_date?: string;
  authority: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRule {
  id: string;
  framework_id: string;
  rule_code: string;
  title: string;
  description?: string;
  rule_type: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_mandatory: boolean;
  is_active: boolean;
  remediation_guidance?: string;
}

interface ComplianceState {
  // Data
  frameworks: ComplianceFramework[];
  rules: ComplianceRule[];
  selectedFramework: string | null;
  
  // UI State
  searchTerm: string;
  isAddFrameworkOpen: boolean;
  isAddRuleOpen: boolean;
  isAutoAssignOpen: boolean;
  
  // Loading & Error States
  loading: boolean;
  error: string | null;
  
  // Actions - Frameworks
  setFrameworks: (frameworks: ComplianceFramework[]) => void;
  addFramework: (framework: ComplianceFramework) => void;
  updateFramework: (id: string, updates: Partial<ComplianceFramework>) => void;
  deleteFramework: (id: string) => void;
  
  // Actions - Rules
  setRules: (rules: ComplianceRule[]) => void;
  addRule: (rule: ComplianceRule) => void;
  updateRule: (id: string, updates: Partial<ComplianceRule>) => void;
  deleteRule: (id: string) => void;
  
  // Actions - UI
  setSelectedFramework: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setIsAddFrameworkOpen: (open: boolean) => void;
  setIsAddRuleOpen: (open: boolean) => void;
  setIsAutoAssignOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  frameworks: [],
  rules: [],
  selectedFramework: null,
  searchTerm: '',
  isAddFrameworkOpen: false,
  isAddRuleOpen: false,
  isAutoAssignOpen: false,
  loading: false,
  error: null,
};

export const useComplianceStore = createComplianceStore<ComplianceState>(
  'ComplianceStore',
  (set, get) => ({
    ...initialState,
    
    // Frameworks Actions
    setFrameworks: (frameworks) => {
      set({ frameworks });
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'frameworks_loaded',
        changes: { count: frameworks.length },
      });
    },
    
    addFramework: (framework) => {
      set((state: any) => ({
        frameworks: [...state.frameworks, framework],
      }));
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'framework_created',
        entityId: framework.id,
        changes: { name: framework.name, code: framework.code },
      });
    },
    
    updateFramework: (id, updates) => {
      const oldFramework = get().frameworks.find((f: ComplianceFramework) => f.id === id);
      
      set((state: any) => ({
        frameworks: state.frameworks.map((f: ComplianceFramework) =>
          f.id === id ? { ...f, ...updates, updated_at: new Date().toISOString() } : f
        ),
      }));
      
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'framework_updated',
        entityId: id,
        changes: { old: oldFramework, new: updates },
      });
    },
    
    deleteFramework: (id) => {
      const framework = get().frameworks.find((f: ComplianceFramework) => f.id === id);
      
      set((state: any) => ({
        frameworks: state.frameworks.filter((f: ComplianceFramework) => f.id !== id),
        rules: state.rules.filter((r: ComplianceRule) => r.framework_id !== id), // Cascade delete rules
      }));
      
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'framework_deleted',
        entityId: id,
        changes: { name: framework?.name },
      });
    },
    
    // Rules Actions
    setRules: (rules) => {
      set({ rules });
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'rules_loaded',
        changes: { count: rules.length },
      });
    },
    
    addRule: (rule) => {
      set((state: any) => ({
        rules: [...state.rules, rule],
      }));
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'rule_created',
        entityId: rule.id,
        changes: { title: rule.title, code: rule.rule_code, severity: rule.severity },
      });
    },
    
    updateRule: (id, updates) => {
      const oldRule = get().rules.find((r: ComplianceRule) => r.id === id);
      
      set((state: any) => ({
        rules: state.rules.map((r: ComplianceRule) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      }));
      
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'rule_updated',
        entityId: id,
        changes: { old: oldRule, new: updates },
      });
    },
    
    deleteRule: (id) => {
      const rule = get().rules.find((r: ComplianceRule) => r.id === id);
      
      set((state: any) => ({
        rules: state.rules.filter((r: ComplianceRule) => r.id !== id),
      }));
      
      // Log audit trail
      (get() as any).addAuditLog({
        action: 'rule_deleted',
        entityId: id,
        changes: { title: rule?.title },
      });
    },
    
    // UI Actions
    setSelectedFramework: (id) => set({ selectedFramework: id }),
    setSearchTerm: (term) => set({ searchTerm: term }),
    setIsAddFrameworkOpen: (open) => set({ isAddFrameworkOpen: open }),
    setIsAddRuleOpen: (open) => set({ isAddRuleOpen: open }),
    setIsAutoAssignOpen: (open) => set({ isAutoAssignOpen: open }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    
    // Reset
    reset: () => set(initialState),
  }),
  {
    // Only persist selected framework
    persistKeys: ['selectedFramework'],
    
    // Define sensitive fields that need protection
    sensitiveFields: {
      // Framework fields
      'authority': 'internal',
      'auto_assignment_rules': 'confidential',
      
      // Rule fields  
      'validation_logic': 'confidential',
      'remediation_guidance': 'internal',
    },
    
    // Define mask patterns for specific fields
    fieldMaskPatterns: {
      'authority': 'partial',           // Show first/last chars
      'website': 'partial',              // Show first/last chars of URL
      'auto_assignment_rules': 'hash',   // Show as [REDACTED-X]
      'validation_logic': 'hash',        // Show as [REDACTED-X]
    },
    
    // Fields that cannot be modified after creation
    immutableFields: [
      'id',
      'created_at',
      'created_by',
      'code', // Framework/rule codes are immutable
      'framework_id', // Cannot reassign rules to different frameworks
    ],
  }
);
