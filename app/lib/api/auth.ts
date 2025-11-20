import { API_ENDPOINTS, API_BASE_URL } from '~/constants/api';

export interface LoginCredentials {
    email?: string;
    password?: string;
    provider?: 'github' | 'google' | 'microsoft';
    code?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        roles: string[];
        organizationId?: string;
    };
}

async function clientFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Use local API in development if not configured
    const baseUrl = API_BASE_URL.includes('api.openhims.health') && (typeof window !== 'undefined' && window.location.hostname === 'localhost')
        ? 'http://localhost:8081/api/v1'
        : API_BASE_URL;

    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        return clientFetch<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    logout: async () => {
        return clientFetch<void>(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
        });
    },

    checkAuth: async () => {
        return clientFetch<{ isAuthenticated: boolean; user?: AuthResponse['user'] }>(
            API_ENDPOINTS.AUTH.CHECK
        );
    },
};
