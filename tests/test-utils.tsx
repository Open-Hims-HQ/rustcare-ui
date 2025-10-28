import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 'user-123',
  userId: 'user-123',
  roles: ['admin'],
  organizationId: 'org-123',
  attributes: {},
};

/**
 * Mock loader data with user context
 */
export const mockLoaderData = {
  user: mockUser,
};

/**
 * Mock implementations for Remix hooks
 */
let mockMatchesData: any = [
  {
    id: 'root',
    pathname: '/',
    params: {},
    data: mockLoaderData,
    handle: undefined,
  },
];

let mockLoaderDataValue: any = mockLoaderData;
let mockNavigateFn = vi.fn();
let mockLocationValue = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

/**
 * Update mock data for Remix hooks
 */
export function updateRemixMocks(loaderData: any = mockLoaderData) {
  mockMatchesData = [
    {
      id: 'root',
      pathname: '/',
      params: {},
      data: loaderData,
      handle: undefined,
    },
  ];
  mockLoaderDataValue = loaderData;
}

/**
 * Setup Remix mocks - to be called in setup.ts
 */
export function setupRemixMocks(loaderData: any = mockLoaderData) {
  updateRemixMocks(loaderData);
}

/**
 * Clear all Remix mocks
 */
export function clearRemixMocks() {
  mockNavigateFn.mockClear();
  updateRemixMocks(mockLoaderData);
}

/**
 * Get the current mock implementations
 */
export const remixMocks = {
  useMatches: () => mockMatchesData,
  useLoaderData: () => mockLoaderDataValue,
  useNavigate: () => mockNavigateFn,
  useLocation: () => mockLocationValue,
};

/**
 * Custom render function that sets up Remix mocks
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  loaderData?: any;
  setupMocks?: boolean;
}

export function renderWithRemix(
  ui: ReactElement,
  {
    loaderData = mockLoaderData,
    setupMocks = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  if (setupMocks) {
    setupRemixMocks(loaderData);
  }

  return render(ui, renderOptions);
}

/**
 * Wrapper component that can be used with renderHook
 */
export function createRemixWrapper(loaderData: any = mockLoaderData) {
  setupRemixMocks(loaderData);
  
  return function Wrapper({ children }: { children: ReactNode }) {
    return <>{children}</>;
  };
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
