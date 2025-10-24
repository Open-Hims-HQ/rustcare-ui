import { createEnhancedStore, defineStoreConfig } from './createEnhancedStore';

interface ResourceState {
  // UI State
  searchTerm: string;
  filterType: string;

  // Actions - UI State
  setSearchTerm: (term: string) => void;
  setFilterType: (type: string) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  searchTerm: "",
  filterType: "all",
};

export const useResourceStore = createEnhancedStore<ResourceState>(
  defineStoreConfig({
    name: 'ResourceStore',
    features: {
      auditLog: false,
      persistence: false,
      devtools: true,
    },
  }),
  (set) => ({
    ...initialState,

    // UI State Actions
    setSearchTerm: (term) => set({ searchTerm: term }),
    setFilterType: (type) => set({ filterType: type }),

    // Reset
    reset: () => set(initialState),
  })
);
