import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user) =>
          set({ user, isAuthenticated: !!user }),

        setToken: (token) =>
          set({ token }),

        login: (user, token) =>
          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          }),

        logout: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          }),

        setLoading: (loading) =>
          set({ isLoading: loading }),

        setError: (error) =>
          set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          // Persist user and token across sessions
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
