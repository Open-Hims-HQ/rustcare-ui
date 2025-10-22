import type {
  Resource,
  PermissionGroup,
  Role,
  UserPermissions,
  CheckPermissionRequest,
  CheckPermissionResponse,
} from "~/types/permissions";

const API_BASE = "http://localhost:8080/api/v1";

// Generic fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Resources API
export const resourcesApi = {
  list: () => apiFetch<Resource[]>("/permissions/resources"),
  
  create: (resource: Omit<Resource, "id" | "created_at" | "updated_at">) =>
    apiFetch<Resource>("/permissions/resources", {
      method: "POST",
      body: JSON.stringify(resource),
    }),
  
  get: (id: string) => apiFetch<Resource>(`/permissions/resources/${id}`),
  
  update: (id: string, resource: Partial<Resource>) =>
    apiFetch<Resource>(`/permissions/resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(resource),
    }),
  
  delete: (id: string) =>
    apiFetch<void>(`/permissions/resources/${id}`, {
      method: "DELETE",
    }),
};

// Permission Groups API
export const groupsApi = {
  list: () => apiFetch<PermissionGroup[]>("/permissions/groups"),
  
  create: (
    group: Omit<PermissionGroup, "id" | "created_at" | "updated_at">
  ) =>
    apiFetch<PermissionGroup>("/permissions/groups", {
      method: "POST",
      body: JSON.stringify(group),
    }),
  
  get: (id: string) => apiFetch<PermissionGroup>(`/permissions/groups/${id}`),
  
  update: (id: string, group: Partial<PermissionGroup>) =>
    apiFetch<PermissionGroup>(`/permissions/groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(group),
    }),
  
  delete: (id: string) =>
    apiFetch<void>(`/permissions/groups/${id}`, {
      method: "DELETE",
    }),
};

// Roles API
export const rolesApi = {
  list: () => apiFetch<Role[]>("/permissions/roles"),
  
  create: (role: Omit<Role, "id" | "created_at" | "updated_at">) =>
    apiFetch<Role>("/permissions/roles", {
      method: "POST",
      body: JSON.stringify(role),
    }),
  
  get: (id: string) => apiFetch<Role>(`/permissions/roles/${id}`),
  
  update: (id: string, role: Partial<Role>) =>
    apiFetch<Role>(`/permissions/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(role),
    }),
  
  delete: (id: string) =>
    apiFetch<void>(`/permissions/roles/${id}`, {
      method: "DELETE",
    }),
};

// User Permissions API
export const userPermissionsApi = {
  get: (userId: string) =>
    apiFetch<UserPermissions>(`/permissions/users/${userId}`),
  
  update: (userId: string, permissions: Partial<UserPermissions>) =>
    apiFetch<UserPermissions>(`/permissions/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(permissions),
    }),
  
  check: (request: CheckPermissionRequest) =>
    apiFetch<CheckPermissionResponse>("/auth/check", {
      method: "POST",
      body: JSON.stringify(request),
    }),
};
