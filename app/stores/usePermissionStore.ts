import { createEnhancedStore, defineStoreConfig } from './createEnhancedStore';
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

export const usePermissionStore = createEnhancedStore<PermissionState>(
  defineStoreConfig({
    name: 'PermissionStore',
    
    features: {
      auditLog: true, // Track permission changes
      persistence: true,
      devtools: true,
    },
    
    persistence: {
      keys: ['selectedResource', 'selectedGroup', 'selectedRole'],
    },
  }),
  (set, get) => ({
    ...initialState,

    // Resources Actions
    setResources: (resources) => set({ resources }),
    addResource: (resource) => {
      set((state: any) => ({ resources: [...state.resources, resource] }));
      get().addAuditEntry({
        action: 'CREATE_RESOURCE',
        entityType: 'resource',
        entityId: resource.id,
        after: resource,
      });
    },
    updateResource: (id, updates) => {
      const resource = get().resources.find((r: any) => r.id === id);
      set((state: any) => ({
        resources: state.resources.map((r: any) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      }));
      get().addAuditEntry({
        action: 'UPDATE_RESOURCE',
        entityType: 'resource',
        entityId: id,
        before: resource,
        after: { ...resource, ...updates },
      });
    },
    deleteResource: (id) => {
      const resource = get().resources.find((r: any) => r.id === id);
      set((state: any) => ({
        resources: state.resources.filter((r: any) => r.id !== id),
      }));
      get().addAuditEntry({
        action: 'DELETE_RESOURCE',
        entityType: 'resource',
        entityId: id,
        before: resource,
      });
    },
    selectResource: (resource) => set({ selectedResource: resource }),
    setResourcesLoading: (loading) => set({ resourcesLoading: loading }),
    setResourcesError: (error) => set({ resourcesError: error }),

    // Groups Actions
    setGroups: (groups) => set({ groups }),
    addGroup: (group) => {
      set((state: any) => ({ groups: [...state.groups, group] }));
      get().addAuditEntry({
        action: 'CREATE_GROUP',
        entityType: 'group',
        entityId: group.id,
        after: group,
      });
    },
    updateGroup: (id, updates) => {
      const group = get().groups.find((g: any) => g.id === id);
      set((state: any) => ({
        groups: state.groups.map((g: any) =>
          g.id === id ? { ...g, ...updates } : g
        ),
      }));
      get().addAuditEntry({
        action: 'UPDATE_GROUP',
        entityType: 'group',
        entityId: id,
        before: group,
        after: { ...group, ...updates },
      });
    },
    deleteGroup: (id) => {
      const group = get().groups.find((g: any) => g.id === id);
      set((state: any) => ({
        groups: state.groups.filter((g: any) => g.id !== id),
      }));
      get().addAuditEntry({
        action: 'DELETE_GROUP',
        entityType: 'group',
        entityId: id,
        before: group,
      });
    },
    selectGroup: (group) => set({ selectedGroup: group }),
    setGroupsLoading: (loading) => set({ groupsLoading: loading }),
    setGroupsError: (error) => set({ groupsError: error }),

    // Roles Actions
    setRoles: (roles) => set({ roles }),
    addRole: (role) => {
      set((state: any) => ({ roles: [...state.roles, role] }));
      get().addAuditEntry({
        action: 'CREATE_ROLE',
        entityType: 'role',
        entityId: role.id,
        after: role,
      });
    },
    updateRole: (id, updates) => {
      const role = get().roles.find((r: any) => r.id === id);
      set((state: any) => ({
        roles: state.roles.map((r: any) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      }));
      get().addAuditEntry({
        action: 'UPDATE_ROLE',
        entityType: 'role',
        entityId: id,
        before: role,
        after: { ...role, ...updates },
      });
    },
    deleteRole: (id) => {
      const role = get().roles.find((r: any) => r.id === id);
      set((state: any) => ({
        roles: state.roles.filter((r: any) => r.id !== id),
      }));
      get().addAuditEntry({
        action: 'DELETE_ROLE',
        entityType: 'role',
        entityId: id,
        before: role,
      });
    },
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
  })
);
