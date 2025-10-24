/**
 * Server-Side API Client for Remix Loaders/Actions
 * 
 * This runs on the server and communicates directly with the Rust backend
 * without going through the browser. No CSRF tokens or cookies needed here.
 */

import type {
  Resource,
  PermissionGroup,
  Role,
  UserPermissions,
  CheckPermissionRequest,
  CheckPermissionResponse,
} from "~/types/permissions";
import { API_BASE_URL, API_ENDPOINTS } from "~/constants/api";

/**
 * Server-side fetch with timeout
 */
async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit & { timeout?: number }
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options || {};
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // In development, allow self-signed certificates
    const fetchOptions2: RequestInit = {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    };

    // @ts-ignore - Node.js specific option for self-signed certs
    if (process.env.NODE_ENV === 'development' || process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
      // For development with self-signed certificates
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions2);

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            errorMessage = errorText;
          }
        }
      } catch {
        // If we can't read the error body, use the status text
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return undefined as T;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }

    throw error;
  }
}

// Resources API
export const resourcesApi = {
  list: () => serverFetch<Resource[]>(API_ENDPOINTS.PERMISSIONS.RESOURCES),
  
  create: (resource: Omit<Resource, "id" | "created_at" | "updated_at">) =>
    serverFetch<Resource>(API_ENDPOINTS.PERMISSIONS.RESOURCES, {
      method: "POST",
      body: JSON.stringify(resource),
    }),
  
  get: (id: string) => serverFetch<Resource>(API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id)),
  
  update: (id: string, resource: Partial<Resource>) =>
    serverFetch<Resource>(API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(resource),
    }),
  
  delete: (id: string) =>
    serverFetch<void>(API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id), {
      method: "DELETE",
    }),
};

// Permission Groups API
export const groupsApi = {
  list: () => serverFetch<PermissionGroup[]>(API_ENDPOINTS.PERMISSIONS.GROUPS),
  
  create: (
    group: Omit<PermissionGroup, "id" | "created_at" | "updated_at">
  ) =>
    serverFetch<PermissionGroup>(API_ENDPOINTS.PERMISSIONS.GROUPS, {
      method: "POST",
      body: JSON.stringify(group),
    }),
  
  get: (id: string) => serverFetch<PermissionGroup>(API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id)),
  
  update: (id: string, group: Partial<PermissionGroup>) =>
    serverFetch<PermissionGroup>(API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(group),
    }),
  
  delete: (id: string) =>
    serverFetch<void>(API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id), {
      method: "DELETE",
    }),
};

// Roles API
export const rolesApi = {
  list: () => serverFetch<Role[]>(API_ENDPOINTS.PERMISSIONS.ROLES),
  
  create: (role: Omit<Role, "id" | "created_at" | "updated_at">) =>
    serverFetch<Role>(API_ENDPOINTS.PERMISSIONS.ROLES, {
      method: "POST",
      body: JSON.stringify(role),
    }),
  
  get: (id: string) => serverFetch<Role>(API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id)),
  
  update: (id: string, role: Partial<Role>) =>
    serverFetch<Role>(API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(role),
    }),
  
  delete: (id: string) =>
    serverFetch<void>(API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id), {
      method: "DELETE",
    }),
};

// User Permissions API
export const userPermissionsApi = {
  get: (userId: string) =>
    serverFetch<UserPermissions>(API_ENDPOINTS.PERMISSIONS.USER_PERMISSIONS(userId)),
  
  update: (userId: string, permissions: Partial<UserPermissions>) =>
    serverFetch<UserPermissions>(API_ENDPOINTS.PERMISSIONS.USER_PERMISSIONS(userId), {
      method: "PUT",
      body: JSON.stringify(permissions),
    }),
  
  check: (request: CheckPermissionRequest) =>
    serverFetch<CheckPermissionResponse>(API_ENDPOINTS.AUTH.CHECK, {
      method: "POST",
      body: JSON.stringify(request),
    }),
};

// Organizations API
export interface Organization {
  id: string;
  name: string;
  code: string;
  type: "Hospital" | "Clinic" | "Lab" | "Pharmacy";
  address: string;
  contact: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const organizationsApi = {
  list: async () => {
    const response = await serverFetch<ApiResponse<Organization[]>>(API_ENDPOINTS.ORGANIZATIONS);
    return response.data || [];
  },
  
  create: async (org: Omit<Organization, "id" | "created_at" | "updated_at">) => {
    const response = await serverFetch<ApiResponse<Organization>>(API_ENDPOINTS.ORGANIZATIONS, {
      method: "POST",
      body: JSON.stringify(org),
    });
    return response.data;
  },
  
  get: async (id: string) => {
    const response = await serverFetch<ApiResponse<Organization>>(API_ENDPOINTS.ORGANIZATION_BY_ID(id));
    return response.data;
  },
  
  update: async (id: string, org: Partial<Organization>) => {
    const response = await serverFetch<ApiResponse<Organization>>(API_ENDPOINTS.ORGANIZATION_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(org),
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await serverFetch<ApiResponse<void>>(API_ENDPOINTS.ORGANIZATION_BY_ID(id), {
      method: "DELETE",
    });
    return response.data;
  },
};
