import { useState, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Dialog } from "~/components/ui/dialog";
import { API_BASE_URL } from "~/constants/api";

interface Role {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description: string | null;
  role_type: string;
  permissions: string[];
  zanzibar_namespace: string;
  zanzibar_relations: string[];
  is_active: boolean;
  created_at: string;
}

interface RoleTemplate {
  name: string;
  description: string;
  permissions: string[];
}

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [templates, setTemplates] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<RoleTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [newPermission, setNewPermission] = useState("");
  
  // TODO: Get from auth context
  const organizationId = "785ae770-12ac-4aba-9bf8-6686fb53eeaf";

  useEffect(() => {
    fetchRoles();
    fetchTemplates();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/organizations/${organizationId}/roles`
      );
      const data = await response.json();
      if (data.success) {
        setRoles(data.data || []);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch roles");
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setError("Unable to connect to server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/role-templates`);
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  const handleCreateRole = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/organizations/${organizationId}/roles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: roleName,
            description: roleDescription || undefined,
            permissions: permissions,
          }),
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setRoles([...roles, data.data]);
        setShowCreateDialog(false);
        resetForm();
        alert("Role created successfully!");
      } else {
        alert(`Failed to create role: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to create role:", error);
      alert("Failed to create role");
    }
  };

  const handleUseTemplate = (template: RoleTemplate) => {
    setRoleName(template.name);
    setRoleDescription(template.description);
    setPermissions(template.permissions);
    setShowTemplatesDialog(false);
    setShowCreateDialog(true);
  };

  const addPermission = () => {
    if (newPermission.trim() && !permissions.includes(newPermission.trim())) {
      setPermissions([...permissions, newPermission.trim()]);
      setNewPermission("");
    }
  };

  const removePermission = (permission: string) => {
    setPermissions(permissions.filter((p) => p !== permission));
  };

  const resetForm = () => {
    setRoleName("");
    setRoleDescription("");
    setPermissions([]);
    setNewPermission("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-6"></div>
          <p className="text-lg font-medium text-gray-700">Loading roles...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Configure roles and permissions with Zanzibar authorization for healthcare providers
              </p>
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span><strong className="font-semibold text-gray-900">{roles.length}</strong> total roles</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong className="font-semibold text-gray-900">{roles.filter(r => r.is_active).length}</strong> active</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span><strong className="font-semibold text-gray-900">{templates.length}</strong> templates</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <Button
                onClick={() => setShowTemplatesDialog(true)}
                className="inline-flex items-center px-4 py-2.5 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Browse Templates
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Role
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading roles</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Roles Grid */}
        {roles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {role.name}
                    </h3>
                    {role.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
                    )}
                  </div>
                  {role.is_active && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                      Active
                    </span>
                  )}
                </div>

                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Permissions ({role.permissions.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.slice(0, 4).map((permission, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200"
                      >
                        {permission}
                      </span>
                    ))}
                    {role.permissions.length > 4 && (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                        +{role.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize text-gray-900">{role.role_type}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="font-medium">Code:</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">{role.code}</code>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="font-medium">Namespace:</span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">{role.zanzibar_namespace}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !error ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-24 w-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No roles created yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating a custom role or choose from our pre-configured healthcare templates designed for medical organizations
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowTemplatesDialog(true)}
                className="inline-flex items-center px-5 py-2.5 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Browse Templates
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Custom Role
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Dialogs */}
      {showCreateDialog && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Create Role</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="roleName">Role Name *</Label>
                <Input
                  id="roleName"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g., Physician, Nurse, Administrator"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="roleDescription">Description</Label>
                <textarea
                  id="roleDescription"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Describe the role's responsibilities and access level"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newPermission}
                    onChange={(e) => setNewPermission(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addPermission()}
                    placeholder="e.g., read_patient, write_diagnosis"
                  />
                  <Button
                    onClick={addPermission}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>

                {permissions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-md"
                      >
                        {permission}
                        <button
                          onClick={() => removePermission(permission)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                          aria-label={`Remove ${permission}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowCreateDialog(false);
                  resetForm();
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRole}
                disabled={!roleName.trim() || permissions.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Role
              </Button>
            </div>
          </Card>
        </div>
      </Dialog>
      )}

      {showTemplatesDialog && (
        <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Role Templates</h2>
            <p className="text-gray-600 mb-6">
              Choose a pre-defined healthcare role template to get started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template, idx) => (
                <Card
                  key={idx}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
                  onClick={() => handleUseTemplate(template)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.permissions.slice(0, 4).map((permission, pidx) => (
                      <span
                        key={pidx}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {permission}
                      </span>
                    ))}
                    {template.permissions.length > 4 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{template.permissions.length - 4} more
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setShowTemplatesDialog(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      </Dialog>
      )}
    </div>
  );
}
