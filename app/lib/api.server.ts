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
 * API request helper that includes auth headers from request
 */
export async function apiRequest(
  request: Request,
  endpoint: string,
  options?: RequestInit & { timeout?: number }
): Promise<any> {
  const cookies = request.headers.get('Cookie') || '';
  const authToken = cookies.split('auth_token=')[1]?.split(';')[0];
  
  const response = await serverFetch(endpoint, {
    ...options,
    headers: {
      ...options?.headers,
      'Cookie': cookies,
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    },
  });
  
  return response;
}

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
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || `HTTP ${response.status}` };
      }
      throw new Error(errorData.message || `API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// ============================================================================
// Permission Management API
// ============================================================================

export async function getResources(request: Request): Promise<Resource[]> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.RESOURCES);
  return response.data || [];
}

export async function getResourceById(request: Request, id: string): Promise<Resource> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id));
  return response.data;
}

export async function createResource(request: Request, resource: Partial<Resource>): Promise<Resource> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.RESOURCES, {
    method: 'POST',
    body: JSON.stringify(resource),
  });
  return response.data;
}

export async function updateResource(request: Request, id: string, resource: Partial<Resource>): Promise<Resource> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(resource),
  });
  return response.data;
}

export async function deleteResource(request: Request, id: string): Promise<void> {
  await apiRequest(request, API_ENDPOINTS.PERMISSIONS.RESOURCE_BY_ID(id), {
    method: 'DELETE',
  });
}

export async function getPermissionGroups(request: Request): Promise<PermissionGroup[]> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.GROUPS);
  return response.data || [];
}

export async function getPermissionGroupById(request: Request, id: string): Promise<PermissionGroup> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id));
  return response.data;
}

export async function createPermissionGroup(request: Request, group: Partial<PermissionGroup>): Promise<PermissionGroup> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.GROUPS, {
    method: 'POST',
    body: JSON.stringify(group),
  });
  return response.data;
}

export async function updatePermissionGroup(request: Request, id: string, group: Partial<PermissionGroup>): Promise<PermissionGroup> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(group),
  });
  return response.data;
}

export async function deletePermissionGroup(request: Request, id: string): Promise<void> {
  await apiRequest(request, API_ENDPOINTS.PERMISSIONS.GROUP_BY_ID(id), {
    method: 'DELETE',
  });
}

export async function getRoles(request: Request): Promise<Role[]> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.ROLES);
  return response.data || [];
}

export async function getRoleById(request: Request, id: string): Promise<Role> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id));
  return response.data;
}

export async function createRole(request: Request, role: Partial<Role>): Promise<Role> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.ROLES, {
    method: 'POST',
    body: JSON.stringify(role),
  });
  return response.data;
}

export async function updateRole(request: Request, id: string, role: Partial<Role>): Promise<Role> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(role),
  });
  return response.data;
}

export async function deleteRole(request: Request, id: string): Promise<void> {
  await apiRequest(request, API_ENDPOINTS.PERMISSIONS.ROLE_BY_ID(id), {
    method: 'DELETE',
  });
}

export async function getUserPermissions(request: Request, userId: string): Promise<UserPermissions> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.USER_PERMISSIONS(userId));
  return response.data;
}

export async function checkPermission(request: Request, check: CheckPermissionRequest): Promise<CheckPermissionResponse> {
  const response = await apiRequest(request, API_ENDPOINTS.PERMISSIONS.CHECK, {
    method: 'POST',
    body: JSON.stringify(check),
  });
  return response.data;
}

// ============================================================================
// Organizations API
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  address_line1?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
  settings: Record<string, any>;
  subscription_tier: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getOrganizations(request: Request): Promise<Organization[]> {
  const response = await apiRequest(request, API_ENDPOINTS.ORGANIZATIONS);
  return response.data || [];
}

export async function getOrganizationById(request: Request, id: string): Promise<Organization> {
  const response = await apiRequest(request, API_ENDPOINTS.ORGANIZATION_BY_ID(id));
  return response.data;
}

// ============================================================================
// Onboarding API
// ============================================================================

export interface CreateUserRequest {
  organization_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  send_credentials?: boolean;
}

export interface CreateUserResponse {
  user_id: string;
  email: string;
  temporary_password?: string;
  message: string;
}

export const onboardingApi = {
  async createUser(request: Request, data: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await apiRequest(request, API_ENDPOINTS.ORGANIZATION_USERS(data.organization_id), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async listUsers(request: Request, organizationId: string): Promise<any[]> {
    const response = await apiRequest(request, API_ENDPOINTS.ORGANIZATION_USERS(organizationId));
    return response.data || [];
  },

  async resendCredentials(request: Request, userId: string): Promise<void> {
    await apiRequest(request, API_ENDPOINTS.RESEND_CREDENTIALS(userId), {
      method: 'POST',
    });
  },

  async verifyEmailConfig(request: Request): Promise<any> {
    const response = await apiRequest(request, API_ENDPOINTS.EMAIL_VERIFY, {
      method: 'POST',
    });
    return response.data;
  },
};

// ============================================================================
// Forms API
// ============================================================================

export interface FormDefinition {
  id: string;
  organization_id: string;
  form_name: string;
  form_slug: string;
  display_name: string;
  description?: string;
  module_name: string;
  entity_type?: string;
  form_schema: any;
  form_layout?: any;
  validation_rules?: any;
  submission_handler?: string;
  is_active: boolean;
  is_template: boolean;
  allow_multiple_submissions: boolean;
  require_approval: boolean;
  requires_permission?: string;
  required_roles?: string[];
  allowed_roles?: string[];
  version: number;
  parent_form_id?: string;
  tags?: string[];
  category?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface FormSubmission {
  id: string;
  organization_id: string;
  form_definition_id: string;
  submission_data: any;
  submission_status: string;
  entity_type?: string;
  entity_id?: string;
  submitted_by?: string;
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  form_version: number;
  created_at: string;
  updated_at: string;
}

export interface SubmitFormRequest {
  form_definition_id: string;
  submission_data: any;
  entity_type?: string;
  entity_id?: string;
  notes?: string;
}

export const formsApi = {
  async listForms(request: Request, params?: {
    module_name?: string;
    entity_type?: string;
    is_template?: boolean;
    is_active?: boolean;
    category?: string;
  }): Promise<FormDefinition[]> {
    const queryParams = new URLSearchParams();
    if (params?.module_name) queryParams.append('module_name', params.module_name);
    if (params?.entity_type) queryParams.append('entity_type', params.entity_type);
    if (params?.is_template !== undefined) queryParams.append('is_template', String(params.is_template));
    if (params?.is_active !== undefined) queryParams.append('is_active', String(params.is_active));
    if (params?.category) queryParams.append('category', params.category);
    
    const query = queryParams.toString();
    const endpoint = query ? `${API_ENDPOINTS.FORMS.LIST}?${query}` : API_ENDPOINTS.FORMS.LIST;
    const response = await apiRequest(request, endpoint);
    return response.data || [];
  },

  async getFormById(request: Request, id: string): Promise<FormDefinition> {
    const response = await apiRequest(request, API_ENDPOINTS.FORMS.BY_ID(id));
    return response.data;
  },

  async getFormBySlug(request: Request, slug: string): Promise<FormDefinition> {
    const response = await apiRequest(request, API_ENDPOINTS.FORMS.BY_SLUG(slug));
    return response.data;
  },

  async createForm(request: Request, form: Partial<FormDefinition>): Promise<FormDefinition> {
    const response = await apiRequest(request, API_ENDPOINTS.FORMS.CREATE, {
      method: 'POST',
      body: JSON.stringify(form),
    });
    return response.data;
  },

  async updateForm(request: Request, id: string, form: Partial<FormDefinition>): Promise<FormDefinition> {
    const response = await apiRequest(request, API_ENDPOINTS.FORMS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(form),
    });
    return response.data;
  },

  async deleteForm(request: Request, id: string): Promise<void> {
    await apiRequest(request, API_ENDPOINTS.FORMS.BY_ID(id), {
      method: 'DELETE',
    });
  },

  async submitForm(request: Request, submission: SubmitFormRequest): Promise<FormSubmission> {
    const response = await apiRequest(request, API_ENDPOINTS.FORMS.SUBMIT, {
      method: 'POST',
      body: JSON.stringify(submission),
    });
    return response.data;
  },

  async getSubmissions(request: Request, formId: string): Promise<FormSubmission[]> {
    const response = await apiRequest(request, API_ENDPOINTS.FORMS.SUBMISSIONS(formId));
    return response.data || [];
  },
};
