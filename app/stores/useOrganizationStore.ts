import { createEnhancedStore, defineStoreConfig } from './createEnhancedStore';
import type { Organization, Hospital } from '~/types/permissions';

interface OrganizationState {
  // Organizations
  organizations: Organization[];
  selectedOrganization: Organization | null;
  organizationsLoading: boolean;
  organizationsError: string | null;

  // Hospitals
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  hospitalsLoading: boolean;
  hospitalsError: string | null;

  // UI State
  showAddForm: boolean;
  searchQuery: string;
  filterType: Organization["type"] | "all";

  // Actions - Organizations
  setOrganizations: (organizations: Organization[]) => void;
  addOrganization: (organization: Organization) => void;
  updateOrganization: (id: string, organization: Partial<Organization>) => void;
  deleteOrganization: (id: string) => void;
  selectOrganization: (organization: Organization | null) => void;
  setOrganizationsLoading: (loading: boolean) => void;
  setOrganizationsError: (error: string | null) => void;

  // Actions - Hospitals
  setHospitals: (hospitals: Hospital[]) => void;
  addHospital: (hospital: Hospital) => void;
  updateHospital: (id: string, hospital: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;
  selectHospital: (hospital: Hospital | null) => void;
  setHospitalsLoading: (loading: boolean) => void;
  setHospitalsError: (error: string | null) => void;

  // Actions - UI State
  setShowAddForm: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: Organization["type"] | "all") => void;

  // Reset
  reset: () => void;
}

const initialState = {
  organizations: [],
  selectedOrganization: null,
  organizationsLoading: false,
  organizationsError: null,

  hospitals: [],
  selectedHospital: null,
  hospitalsLoading: false,
  hospitalsError: null,

  showAddForm: false,
  searchQuery: "",
  filterType: "all" as Organization["type"] | "all",
};

export const useOrganizationStore = createEnhancedStore<OrganizationState>(
  defineStoreConfig({
    name: 'OrganizationStore',
    
    features: {
      auditLog: true, // Track all CRUD operations
      persistence: true,
      devtools: true,
    },
    
    persistence: {
      keys: ['selectedOrganization', 'selectedHospital'],
    },
  }),
  (set, get) => ({
    ...initialState,

    // Organizations Actions
    setOrganizations: (organizations) => set({ organizations }),
    
    addOrganization: (organization) => {
      set((state) => ({
        organizations: [...state.organizations, organization],
      }));
      get().addAuditEntry({
        action: 'CREATE_ORGANIZATION',
        entityType: 'organization',
        entityId: organization.id,
        after: organization,
      });
    },
    
    updateOrganization: (id, updates) => {
      const org = get().organizations.find(o => o.id === id);
      set((state) => ({
        organizations: state.organizations.map((o) =>
          o.id === id ? { ...o, ...updates } : o
        ),
      }));
      get().addAuditEntry({
        action: 'UPDATE_ORGANIZATION',
        entityType: 'organization',
        entityId: id,
        before: org,
        after: { ...org, ...updates },
      });
    },
    
    deleteOrganization: (id) => {
      const org = get().organizations.find(o => o.id === id);
      set((state) => ({
        organizations: state.organizations.filter((o) => o.id !== id),
      }));
      get().addAuditEntry({
        action: 'DELETE_ORGANIZATION',
        entityType: 'organization',
        entityId: id,
        before: org,
      });
    },
    
    selectOrganization: (organization) =>
      set({ selectedOrganization: organization }),
    setOrganizationsLoading: (loading) =>
      set({ organizationsLoading: loading }),
    setOrganizationsError: (error) =>
      set({ organizationsError: error }),

    // Hospitals Actions
    setHospitals: (hospitals) => set({ hospitals }),
    
    addHospital: (hospital) => {
      set((state) => ({
        hospitals: [...state.hospitals, hospital],
      }));
      get().addAuditEntry({
        action: 'CREATE_HOSPITAL',
        entityType: 'hospital',
        entityId: hospital.id,
        after: hospital,
      });
    },
    
    updateHospital: (id, updates) => {
      const hospital = get().hospitals.find(h => h.id === id);
      set((state) => ({
        hospitals: state.hospitals.map((h) =>
          h.id === id ? { ...h, ...updates } : h
        ),
      }));
      get().addAuditEntry({
        action: 'UPDATE_HOSPITAL',
        entityType: 'hospital',
        entityId: id,
        before: hospital,
        after: { ...hospital, ...updates },
      });
    },
    
    deleteHospital: (id) => {
      const hospital = get().hospitals.find(h => h.id === id);
      set((state) => ({
        hospitals: state.hospitals.filter((h) => h.id !== id),
      }));
      get().addAuditEntry({
        action: 'DELETE_HOSPITAL',
        entityType: 'hospital',
        entityId: id,
        before: hospital,
      });
    },
    
    selectHospital: (hospital) => set({ selectedHospital: hospital }),
    setHospitalsLoading: (loading) => set({ hospitalsLoading: loading }),
    setHospitalsError: (error) => set({ hospitalsError: error }),

    // UI State Actions
    setShowAddForm: (show) => set({ showAddForm: show }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilterType: (type) => set({ filterType: type }),

    // Reset
    reset: () => set(initialState),
  })
);
