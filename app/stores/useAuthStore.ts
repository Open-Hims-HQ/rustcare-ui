import { createEnhancedStore, defineStoreConfig, MaskingType } from './createEnhancedStore';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  organizationId?: string;
}

interface AuthState {
  // User Session
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = createEnhancedStore<AuthState>(
  defineStoreConfig({
    name: 'AuthStore',
    
    // Mask sensitive fields
    fields: {
      token: {
        maskingType: MaskingType.DYNAMIC,
        maskPattern: 'partial',
      },
      email: {
        maskingType: MaskingType.DYNAMIC,
        maskPattern: 'email',
      },
    },
    
    features: {
      auditLog: true, // Track login/logout
      persistence: true,
      devtools: true,
    },
    
    persistence: {
      keys: ['user', 'token', 'isAuthenticated'],
    },
    
    // Inject user context from auth state itself
    contextProvider: () => {
      const state = useAuthStore.getState();
      return state.user ? {
        userId: state.user.id,
        roles: state.user.roles,
        permissions: [], // Would come from permissions store
        organizationId: state.user.organizationId,
      } : null;
    },
  }),
  (set, get) => ({
    ...initialState,

    setUser: (user) => {
      set({ user, isAuthenticated: !!user });
      get().addAuditEntry({
        action: 'SET_USER',
        entityType: 'user',
        entityId: user?.id,
        after: user,
      });
    },

    setToken: (token) =>
      set({ token }),

    login: (user, token) => {
      set({
        user,
        token,
        isAuthenticated: true,
        error: null,
      });
      get().addAuditEntry({
        action: 'LOGIN',
        entityType: 'user',
        entityId: user.id,
        after: { userId: user.id, email: user.email },
      });
    },

    logout: () => {
      const userId = get().user?.id;
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
      get().addAuditEntry({
        action: 'LOGOUT',
        entityType: 'user',
        entityId: userId,
      });
    },

    setLoading: (loading) =>
      set({ isLoading: loading }),

    setError: (error) =>
      set({ error }),

    reset: () => set(initialState),
  })
);
