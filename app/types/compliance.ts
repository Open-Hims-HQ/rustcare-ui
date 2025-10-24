/**
 * Compliance Type Definitions
 */

export type ComplianceFramework = 
  | "HIPAA"
  | "GDPR"
  | "ISO27001"
  | "SOC2"
  | "HITRUST"
  | "NIST"
  | "PCI-DSS"
  | "CUSTOM";

export type RuleType = "Technical" | "Administrative" | "Physical" | "Legal";

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low";

export type RuleStatus = "Active" | "Draft" | "Archived";

export interface ComplianceRule {
  id: string;
  framework: ComplianceFramework;
  code: string;
  title: string;
  description: string;
  rule_type: RuleType;
  severity: SeverityLevel;
  status: RuleStatus;
  requirements: string[];
  implementation_guidance?: string;
  created_at: string;
  updated_at?: string;
}

export interface ComplianceStats {
  frameworks: number;
  rules: number;
  compliant: number;
  nonCompliant: number;
  pending: number;
}

export interface CreateComplianceRuleInput {
  framework: ComplianceFramework;
  code: string;
  title: string;
  description: string;
  rule_type: RuleType;
  severity: SeverityLevel;
  status: RuleStatus;
  requirements: string[];
  implementation_guidance?: string;
}

export interface UpdateComplianceRuleInput extends Partial<CreateComplianceRuleInput> {
  id: string;
}
