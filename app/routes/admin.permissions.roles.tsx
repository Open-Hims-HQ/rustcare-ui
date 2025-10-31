import React from "react"
import { json } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Card } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Plus, Save, Search, X, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Textarea } from "~/components/ui/textarea"

// Mock data
const mockRoles = [
  { id: 1, name: "admin", description: "Full system access", permissions: 45 },
  { id: 2, name: "doctor", description: "Medical provider access", permissions: 32 },
  { id: 3, name: "nurse", description: "Nursing staff access", permissions: 28 },
  { id: 4, name: "pharmacist", description: "Pharmacy management", permissions: 25 },
  { id: 5, name: "receptionist", description: "Front desk operations", permissions: 15 },
]

const mockPermissionsByCategory = {
  patients: [
    { id: "p1", name: "patient:viewer", description: "View patient records" },
    { id: "p2", name: "patient:owner", description: "Full patient access" },
    { id: "p3", name: "patient:provider", description: "Provider-level access" },
    { id: "p4", name: "patient:read_phi", description: "Read PHI data" },
  ],
  appointments: [
    { id: "a1", name: "appointment:viewer", description: "View appointments" },
    { id: "a2", name: "appointment:editor", description: "Schedule appointments" },
    { id: "a3", name: "appointment:cancel", description: "Cancel appointments" },
  ],
  pharmacy: [
    { id: "ph1", name: "pharmacy:viewer", description: "View inventory" },
    { id: "ph2", name: "pharmacy:editor", description: "Manage prescriptions" },
    { id: "ph3", name: "pharmacy:dispense", description: "Dispense medications" },
  ],
  documents: [
    { id: "d1", name: "document:viewer", description: "View medical records" },
    { id: "d2", name: "document:editor", description: "Edit medical records" },
    { id: "d3", name: "document:owner", description: "Full document control" },
  ],
  admin: [
    { id: "ad1", name: "admin:manage_users", description: "Manage users" },
    { id: "ad2", name: "admin:manage_roles", description: "Manage roles" },
    { id: "ad3", name: "admin:view_audit", description: "View audit logs" },
  ],
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    roles: mockRoles,
    permissions: mockPermissionsByCategory,
  })
}

export default function ZanzibarRolesPage() {
  const { roles, permissions } = useLoaderData<typeof loader>()
  const [selectedRole, setSelectedRole] = React.useState<number | null>(null)
  const [roleName, setRoleName] = React.useState("")
  const [roleDescription, setRoleDescription] = React.useState("")
  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")

  const handlePermissionToggle = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId)
    } else {
      newSelected.add(permissionId)
    }
    setSelectedPermissions(newSelected)
  }

  const handleSaveRole = () => {
    // TODO: Save role to backend
    console.log("Saving role:", { roleName, roleDescription, selectedPermissions })
  }

  const handleCreateNew = () => {
    setSelectedRole(null)
    setRoleName("")
    setRoleDescription("")
    setSelectedPermissions(new Set())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Zanzibar Roles Management</h1>
        <p className="text-gray-600">Create and configure role-based access control using Zanzibar permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Role List */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Existing Roles</h2>
                <Button onClick={handleCreateNew} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2">
                {roles.filter(r => r.name.includes(searchQuery)).map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRole === role.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-semibold">{role.name}</div>
                    <div className="text-sm text-gray-600">{role.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{role.permissions} permissions</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Role Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedRole ? "Edit Role" : "Create New Role"}
              </h2>

              {/* Role Details Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g., doctor, nurse, pharmacist"
                  />
                </div>

                <div>
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Describe what this role can do"
                    rows={3}
                  />
                </div>
              </div>

              {/* Permissions Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Permissions</h3>
                <Tabs defaultValue="patients" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="patients">Patients</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>

                  {Object.entries(permissions).map(([category, perms]) => (
                    <TabsContent key={category} value={category} className="space-y-2">
                      {perms.map((perm) => (
                        <div
                          key={perm.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                          onClick={() => handlePermissionToggle(perm.id)}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedPermissions.has(perm.id)
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}>
                            {selectedPermissions.has(perm.id) && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{perm.name}</div>
                            <div className="text-xs text-gray-500">{perm.description}</div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold mb-2">Permissions Summary</div>
                <div className="text-2xl font-bold text-blue-600">{selectedPermissions.size}</div>
                <div className="text-sm text-gray-600">permissions selected</div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveRole}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Role
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
