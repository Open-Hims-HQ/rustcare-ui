import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
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
};

export const useOrganizationStore = create<OrganizationState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Organizations Actions
        setOrganizations: (organizations) => set({ organizations }),
        addOrganization: (organization) =>
          set((state) => ({
            organizations: [...state.organizations, organization],
          })),
        updateOrganization: (id, updates) =>
          set((state) => ({
            organizations: state.organizations.map((o) =>
              o.id === id ? { ...o, ...updates } : o
            ),
          })),
        deleteOrganization: (id) =>
          set((state) => ({
            organizations: state.organizations.filter((o) => o.id !== id),
          })),
        selectOrganization: (organization) =>
          set({ selectedOrganization: organization }),
        setOrganizationsLoading: (loading) =>
          set({ organizationsLoading: loading }),
        setOrganizationsError: (error) =>
          set({ organizationsError: error }),

        // Hospitals Actions
        setHospitals: (hospitals) => set({ hospitals }),
        addHospital: (hospital) =>
          set((state) => ({
            hospitals: [...state.hospitals, hospital],
          })),
        updateHospital: (id, updates) =>
          set((state) => ({
            hospitals: state.hospitals.map((h) =>
              h.id === id ? { ...h, ...updates } : h
            ),
          })),
        deleteHospital: (id) =>
          set((state) => ({
            hospitals: state.hospitals.filter((h) => h.id !== id),
          })),
        selectHospital: (hospital) => set({ selectedHospital: hospital }),
        setHospitalsLoading: (loading) => set({ hospitalsLoading: loading }),
        setHospitalsError: (error) => set({ hospitalsError: error }),

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: 'organization-storage',
        partialize: (state) => ({
          // Only persist selections
          selectedOrganization: state.selectedOrganization,
          selectedHospital: state.selectedHospital,
        }),
      }
    ),
    { name: 'OrganizationStore' }
  )
);
