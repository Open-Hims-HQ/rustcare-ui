// API Types matching the Rust backend handlers/permissions.rs

export type ResourceType = "Screen" | "Api" | "Module" | "Entity";

export interface Resource {
  id: string;
  resource_type: ResourceType;
  name: string;
  description: string;
  path: string;
  actions: string[];
  parent_module?: string;
  tags: string[];
  contains_phi: boolean;
  created_at: string;
  updated_at: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  members: string[];
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  groups: string[];
  direct_permissions: string[];
  is_system_role: boolean;
  members: string[];
  created_at: string;
  updated_at: string;
}

export interface UserPermissions {
  user_id: string;
  roles: string[];
  groups: string[];
  direct_permissions: string[];
  effective_permissions: string[];
  updated_at: string;
}

export interface CheckPermissionRequest {
  user_id: string;
  resource: string;
  action: string;
}

export interface CheckPermissionResponse {
  allowed: boolean;
  reason?: string;
}

// Organization & Hospital Types (Extended)
export interface Organization {
  id: string;
  name: string;
  code: string;
  type: "Hospital" | "Clinic" | "Lab" | "Pharmacy" | "Other";
  address: string;
  contact: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hospital extends Organization {
  type: "Hospital";
  beds: number;
  departments: string[];
  license_number: string;
}
