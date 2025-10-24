/**
 * Role & Permission Type Definitions
 */

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  granted_at: string;
}

export interface Role {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description: string | null;
  role_type: string;
  permissions: string[];
  zanzibar_namespace: string;
  zanzibar_relations: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateRoleInput {
  organization_id: string;
  name: string;
  code: string;
  description?: string | null;
  role_type: string;
  permissions?: string[];
  zanzibar_namespace: string;
  zanzibar_relations?: string[];
  is_active: boolean;
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {
  id: string;
}

export interface RoleStats {
  total: number;
  active: number;
  byType: Record<string, number>;
}
