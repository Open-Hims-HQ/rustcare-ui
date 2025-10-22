import type {
  Resource,
  PermissionGroup,
  Role,
  UserPermissions,
  CheckPermissionRequest,
  CheckPermissionResponse,
} from "~/types/permissions";
import { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  DEFAULT_HEADERS,
  REQUEST_TIMEOUT,
} from "~/constants/api";

/**
 * Get CSRF token from meta tag (server-generated)
 */
function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag?.getAttribute('content') || null;
}

/**
 * Simple, secure client-side fetch
 * Security is enforced server-side in Remix loaders/actions
 * 
 * Client only handles:
 * - Adding CSRF token to requests
 * - Basic error handling
 * - Timeout
 * - Credentials (HttpOnly cookies managed by browser)
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const method = options?.method || 'GET';
  const csrfToken = getCSRFToken();

  // Build headers
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...(options?.headers as Record<string, string> || {}),
  };

  // Add CSRF token for state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  // Create timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method,
      headers,
      credentials: 'include', // Send HttpOnly cookies (session)
      signal: options?.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Clear client-side auth state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('permission-storage');
          localStorage.removeItem('organization-storage');
        }
        throw new Error('Authentication required. Please log in again.');
      }

      // Handle other errors
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }

      throw new Error(errorMessage);
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return undefined as T;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
    }

    throw error;
  }
}

// Resources API
export const resourcesApi = {
  list: () => apiFetch<Resource[]>(API_ENDPOINTS.PERMISSIONS.RESOURCES),
  
  create: (resource: Omit<Resource, "id" | "created_at" | "updated_at">) =>
    apiFetch<Resource>(API_ENDPOINTS.PERMISSIONS.RESOURCES, {
      method: "POST",
      body: JSON.stringify(resource),
    }),
  
  get: (id: string) => apiFetch<Resource>(API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id)),
  
  update: (id: string, resource: Partial<Resource>) =>
    apiFetch<Resource>(API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(resource),
    }),
  
  delete: (id: string) =>
    apiFetch<void>(API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id), {
      method: "DELETE",
    }),
};

// Permission Groups API
export const groupsApi = {
  list: () => apiFetch<PermissionGroup[]>(API_ENDPOINTS.PERMISSIONS.GROUPS),
  
  create: (
    group: Omit<PermissionGroup, "id" | "created_at" | "updated_at">
  ) =>
    apiFetch<PermissionGroup>(API_ENDPOINTS.PERMISSIONS.GROUPS, {
      method: "POST",
      body: JSON.stringify(group),
    }),
  
  get: (id: string) => apiFetch<PermissionGroup>(API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id)),
  
  update: (id: string, group: Partial<PermissionGroup>) =>
    apiFetch<PermissionGroup>(API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(group),
    }),
  
  delete: (id: string) =>
    apiFetch<void>(API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id), {
      method: "DELETE",
    }),
};

// Roles API
export const rolesApi = {
  list: () => apiFetch<Role[]>(API_ENDPOINTS.PERMISSIONS.ROLES),
  
  create: (role: Omit<Role, "id" | "created_at" | "updated_at">) =>
    apiFetch<Role>(API_ENDPOINTS.PERMISSIONS.ROLES, {
      method: "POST",
      body: JSON.stringify(role),
    }),
  
  get: (id: string) => apiFetch<Role>(API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id)),
  
  update: (id: string, role: Partial<Role>) =>
    apiFetch<Role>(API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(role),
    }),
  
  delete: (id: string) =>
    apiFetch<void>(API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id), {
      method: "DELETE",
    }),
};

// User Permissions API
export const userPermissionsApi = {
  get: (userId: string) =>
    apiFetch<UserPermissions>(API_ENDPOINTS.PERMISSIONS.USER_PERMISSIONS(userId)),
  
  update: (userId: string, permissions: Partial<UserPermissions>) =>
    apiFetch<UserPermissions>(API_ENDPOINTS.PERMISSIONS.USER_PERMISSIONS(userId), {
      method: "PUT",
      body: JSON.stringify(permissions),
    }),
  
  check: (request: CheckPermissionRequest) =>
    apiFetch<CheckPermissionResponse>(API_ENDPOINTS.AUTH.CHECK, {
      method: "POST",
      body: JSON.stringify(request),
    }),
};
