import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock Remix React hooks
vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual('@remix-run/react');
  const { remixMocks } = await import('./test-utils');
  
  return {
    ...actual,
    useMatches: vi.fn(() => remixMocks.useMatches()),
    useLoaderData: vi.fn(() => remixMocks.useLoaderData()),
    useNavigate: vi.fn(() => remixMocks.useNavigate()),
    useLocation: vi.fn(() => remixMocks.useLocation()),
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
