/**
 * Employee Type Definitions
 */

export interface Role {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  code: string;
  role_type: string;
  permissions: string[];
  zanzibar_namespace: string;
  zanzibar_relations: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Employee {
  id: string;
  organization_id: string;
  email: string;
  name: string;
  role_id: string | null;
  role?: Role;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateEmployeeInput {
  organization_id: string;
  email: string;
  name: string;
  role_id?: string | null;
  is_active: boolean;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  id: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  physicians: number;
  nurses: number;
  admin: number;
  support: number;
}
