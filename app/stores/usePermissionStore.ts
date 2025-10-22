import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Resource, PermissionGroup, Role, UserPermissions } from '~/types/permissions';

interface PermissionState {
  // Resources
  resources: Resource[];
  selectedResource: Resource | null;
  resourcesLoading: boolean;
  resourcesError: string | null;

  // Groups
  groups: PermissionGroup[];
  selectedGroup: PermissionGroup | null;
  groupsLoading: boolean;
  groupsError: string | null;

  // Roles
  roles: Role[];
  selectedRole: Role | null;
  rolesLoading: boolean;
  rolesError: string | null;

  // User Permissions
  userPermissions: UserPermissions | null;
  userPermissionsLoading: boolean;
  userPermissionsError: string | null;

  // Actions - Resources
  setResources: (resources: Resource[]) => void;
  addResource: (resource: Resource) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  selectResource: (resource: Resource | null) => void;
  setResourcesLoading: (loading: boolean) => void;
  setResourcesError: (error: string | null) => void;

  // Actions - Groups
  setGroups: (groups: PermissionGroup[]) => void;
  addGroup: (group: PermissionGroup) => void;
  updateGroup: (id: string, group: Partial<PermissionGroup>) => void;
  deleteGroup: (id: string) => void;
  selectGroup: (group: PermissionGroup | null) => void;
  setGroupsLoading: (loading: boolean) => void;
  setGroupsError: (error: string | null) => void;

  // Actions - Roles
  setRoles: (roles: Role[]) => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  selectRole: (role: Role | null) => void;
  setRolesLoading: (loading: boolean) => void;
  setRolesError: (error: string | null) => void;

  // Actions - User Permissions
  setUserPermissions: (permissions: UserPermissions | null) => void;
  setUserPermissionsLoading: (loading: boolean) => void;
  setUserPermissionsError: (error: string | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  resources: [],
  selectedResource: null,
  resourcesLoading: false,
  resourcesError: null,

  groups: [],
  selectedGroup: null,
  groupsLoading: false,
  groupsError: null,

  roles: [],
  selectedRole: null,
  rolesLoading: false,
  rolesError: null,

  userPermissions: null,
  userPermissionsLoading: false,
  userPermissionsError: null,
};

export const usePermissionStore = create<PermissionState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Resources Actions
        setResources: (resources) => set({ resources }),
        addResource: (resource) =>
          set((state) => ({ resources: [...state.resources, resource] })),
        updateResource: (id, updates) =>
          set((state) => ({
            resources: state.resources.map((r) =>
              r.id === id ? { ...r, ...updates } : r
            ),
          })),
        deleteResource: (id) =>
          set((state) => ({
            resources: state.resources.filter((r) => r.id !== id),
          })),
        selectResource: (resource) => set({ selectedResource: resource }),
        setResourcesLoading: (loading) => set({ resourcesLoading: loading }),
        setResourcesError: (error) => set({ resourcesError: error }),

        // Groups Actions
        setGroups: (groups) => set({ groups }),
        addGroup: (group) =>
          set((state) => ({ groups: [...state.groups, group] })),
        updateGroup: (id, updates) =>
          set((state) => ({
            groups: state.groups.map((g) =>
              g.id === id ? { ...g, ...updates } : g
            ),
          })),
        deleteGroup: (id) =>
          set((state) => ({
            groups: state.groups.filter((g) => g.id !== id),
          })),
        selectGroup: (group) => set({ selectedGroup: group }),
        setGroupsLoading: (loading) => set({ groupsLoading: loading }),
        setGroupsError: (error) => set({ groupsError: error }),

        // Roles Actions
        setRoles: (roles) => set({ roles }),
        addRole: (role) =>
          set((state) => ({ roles: [...state.roles, role] })),
        updateRole: (id, updates) =>
          set((state) => ({
            roles: state.roles.map((r) =>
              r.id === id ? { ...r, ...updates } : r
            ),
          })),
        deleteRole: (id) =>
          set((state) => ({
            roles: state.roles.filter((r) => r.id !== id),
          })),
        selectRole: (role) => set({ selectedRole: role }),
        setRolesLoading: (loading) => set({ rolesLoading: loading }),
        setRolesError: (error) => set({ rolesError: error }),

        // User Permissions Actions
        setUserPermissions: (permissions) => set({ userPermissions: permissions }),
        setUserPermissionsLoading: (loading) =>
          set({ userPermissionsLoading: loading }),
        setUserPermissionsError: (error) =>
          set({ userPermissionsError: error }),

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: 'permission-storage',
        partialize: (state) => ({
          // Only persist selections, not loading/error states
          selectedResource: state.selectedResource,
          selectedGroup: state.selectedGroup,
          selectedRole: state.selectedRole,
        }),
      }
    ),
    { name: 'PermissionStore' }
  )
);
