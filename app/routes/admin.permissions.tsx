import React from "react"
import { json } from "@remix-run/node"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Card } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Plus, Edit, Search, Filter } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

// Mock data for permissions management
const mockPermissions = {
  apis: [
    { id: 1, name: "GET /api/v1/patients/:id", method: "GET", resource: "patient", description: "Read patient record", namespace: "patient", relation: "viewer" },
    { id: 2, name: "POST /api/v1/patients", method: "POST", resource: "patient", description: "Create patient", namespace: "patient", relation: "owner" },
    { id: 3, name: "PUT /api/v1/patients/:id", method: "PUT", resource: "patient", description: "Update patient", namespace: "patient", relation: "editor" },
    { id: 4, name: "GET /api/v1/appointments", method: "GET", resource: "appointment", description: "List appointments", namespace: "appointment", relation: "viewer" },
    { id: 5, name: "POST /api/v1/appointments", method: "POST", resource: "appointment", description: "Create appointment", namespace: "appointment", relation: "editor" },
    { id: 6, name: "GET /api/v1/pharmacy/inventory", method: "GET", resource: "pharmacy", description: "View pharmacy inventory", namespace: "pharmacy", relation: "viewer" },
    { id: 7, name: "POST /api/v1/pharmacy/prescriptions", method: "POST", resource: "pharmacy", description: "Create prescription", namespace: "pharmacy", relation: "editor" },
    { id: 8, name: "GET /api/v1/medical-records/:id", method: "GET", resource: "document", description: "Read medical record", namespace: "document", relation: "viewer" },
  ],
  pages: [
    { id: 1, path: "/admin/patients", name: "Patient Management", description: "View and manage patients", required_permission: "patient:viewer" },
    { id: 2, path: "/admin/appointments", name: "Appointment Scheduler", description: "Schedule appointments", required_permission: "appointment:editor" },
    { id: 3, path: "/admin/pharmacy", name: "Pharmacy Management", description: "Manage pharmacy operations", required_permission: "pharmacy:viewer" },
    { id: 4, path: "/admin/emr", name: "EMR Records", description: "Access electronic medical records", required_permission: "document:viewer" },
    { id: 5, path: "/admin/notifications", name: "Notifications", description: "View system notifications", required_permission: "notification:viewer" },
    { id: 6, path: "/admin/permissions", name: "Permissions Management", description: "Manage access control", required_permission: "admin" },
  ],
  actions: [
    { id: 1, name: "create_patient", description: "Create new patient record", namespace: "patient", relation: "owner" },
    { id: 2, name: "read_patient", description: "Read patient data", namespace: "patient", relation: "viewer" },
    { id: 3, name: "update_patient", description: "Update patient information", namespace: "patient", relation: "editor" },
    { id: 4, name: "delete_patient", description: "Delete patient record", namespace: "patient", relation: "owner" },
    { id: 5, name: "view_phi", description: "View PHI (protected health information)", namespace: "patient", relation: "read_phi" },
    { id: 6, name: "create_appointment", description: "Schedule appointment", namespace: "appointment", relation: "editor" },
    { id: 7, name: "prescribe_medication", description: "Write prescription", namespace: "pharmacy", relation: "editor" },
    { id: 8, name: "view_medical_record", description: "Access medical records", namespace: "document", relation: "viewer" },
  ],
  services: [
    { id: 1, name: "email-service", description: "Send emails", permissions: ["email:send"] },
    { id: 2, name: "voice-recognition-service", description: "Voice dictation", permissions: ["voice:transcribe"] },
    { id: 3, name: "notification-service", description: "Send notifications", permissions: ["notification:send"] },
    { id: 4, name: "audit-service", description: "Audit logging", permissions: ["audit:write"] },
  ],
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // TODO: Fetch actual permissions from API
  return json({ permissions: mockPermissions })
}

export default function PermissionsPage() {
  const { permissions } = useLoaderData<typeof loader>()
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const filteredPermissions = {
    apis: permissions.apis.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    pages: permissions.pages.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    actions: permissions.actions.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    services: permissions.services.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Permissions & Access Control</h1>
        <p className="text-gray-600">Manage API permissions, page access, actions, and services for Zanzibar role configuration</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>

      {/* Tabs for different permission types */}
      <Tabs defaultValue="apis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="apis">API Endpoints</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* API Permissions Tab */}
        <TabsContent value="apis">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">API Endpoint Permissions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Namespace</TableHead>
                    <TableHead>Relation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.apis.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell className="font-mono text-sm">{api.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{api.method}</Badge>
                      </TableCell>
                      <TableCell>{api.description}</TableCell>
                      <TableCell>
                        <Badge>{api.namespace}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{api.relation}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Page Permissions Tab */}
        <TabsContent value="pages">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Page Permissions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Required Permission</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-semibold">{page.name}</TableCell>
                      <TableCell className="font-mono text-sm">{page.path}</TableCell>
                      <TableCell>{page.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{page.required_permission}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Actions Permissions Tab */}
        <TabsContent value="actions">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Action Permissions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Namespace</TableHead>
                    <TableHead>Relation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className="font-semibold">{action.name}</TableCell>
                      <TableCell>{action.description}</TableCell>
                      <TableCell>
                        <Badge>{action.namespace}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{action.relation}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Services Permissions Tab */}
        <TabsContent value="services">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Service Permissions</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-semibold">{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.permissions.map((perm, idx) => (
                            <Badge key={idx} variant="outline">{perm}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
