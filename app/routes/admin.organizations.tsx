import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Building2, Hospital, FlaskConical, Pill, Plus, Search, Pencil, Trash2, MoreVertical } from "lucide-react";
import { organizationsApi } from "~/lib/api.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// Organization type definition
export interface Organization {
  id: string;
  name: string;
  code: string;
  type: "Hospital" | "Clinic" | "Lab" | "Pharmacy";
  address: string;
  contact: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Loader: Fetch all organizations
export async function loader({ request }: LoaderFunctionArgs) {
  const organizations = await organizationsApi.list();
  return json({ organizations });
}

// Action: Handle create, update, delete
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      const organization = {
        name: formData.get("name") as string,
        code: formData.get("code") as string,
        type: formData.get("type") as Organization["type"],
        address: formData.get("address") as string,
        contact: formData.get("contact") as string,
        is_active: formData.get("is_active") === "true",
      };
      await organizationsApi.create(organization);
      return json({ success: true, message: "Organization created successfully" });
    }

    if (intent === "delete") {
      const id = formData.get("id") as string;
      await organizationsApi.delete(id);
      return json({ success: true, message: "Organization deleted successfully" });
    }

    return json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return json(
      { success: false, error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

// Organization icon helper
function getOrgIcon(type: Organization["type"]) {
  switch (type) {
    case "Hospital":
      return <Hospital className="h-5 w-5" />;
    case "Clinic":
      return <Building2 className="h-5 w-5" />;
    case "Lab":
      return <FlaskConical className="h-5 w-5" />;
    case "Pharmacy":
      return <Pill className="h-5 w-5" />;
  }
}

// Organization type badge colors
function getTypeBadgeClass(type: Organization["type"]) {
  switch (type) {
    case "Hospital":
      return "bg-red-50 text-red-700 border-red-200";
    case "Clinic":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Lab":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Pharmacy":
      return "bg-green-50 text-green-700 border-green-200";
  }
}

export default function OrganizationsPage() {
  const { organizations } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<Organization["type"] | "all">("all");

  const isSubmitting = navigation.state === "submitting";

  // Filter organizations
  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || org.type === filterType;
    return matchesSearch && matchesType;
  });

  // Stats
  const stats = {
    total: organizations.length,
    hospitals: organizations.filter(o => o.type === "Hospital").length,
    clinics: organizations.filter(o => o.type === "Clinic").length,
    labs: organizations.filter(o => o.type === "Lab").length,
    pharmacies: organizations.filter(o => o.type === "Pharmacy").length,
    active: organizations.filter(o => o.is_active).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Organizations
            </h1>
            <p className="text-slate-600 mt-1">
              Manage hospitals, clinics, labs, and pharmacies
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <Hospital className="h-4 w-4" />
                Hospitals
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.hospitals}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <Building2 className="h-4 w-4" />
                Clinics
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.clinics}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <FlaskConical className="h-4 w-4" />
                Labs
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.labs}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                <Pill className="h-4 w-4" />
                Pharmacies
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.pharmacies}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.active}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              type="search"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search organizations by name, code, or address"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button
              variant={filterType === "Hospital" ? "default" : "outline"}
              onClick={() => setFilterType("Hospital")}
            >
              <Hospital className="mr-2 h-4 w-4" />
              Hospitals
            </Button>
            <Button
              variant={filterType === "Clinic" ? "default" : "outline"}
              onClick={() => setFilterType("Clinic")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Clinics
            </Button>
            <Button
              variant={filterType === "Lab" ? "default" : "outline"}
              onClick={() => setFilterType("Lab")}
            >
              <FlaskConical className="mr-2 h-4 w-4" />
              Labs
            </Button>
            <Button
              variant={filterType === "Pharmacy" ? "default" : "outline"}
              onClick={() => setFilterType("Pharmacy")}
            >
              <Pill className="mr-2 h-4 w-4" />
              Pharmacies
            </Button>
          </div>
        </div>

        {/* Add Organization Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" onSubmit={() => setShowAddForm(false)}>
                <input type="hidden" name="intent" value="create" />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Clinic">Clinic</SelectItem>
                        <SelectItem value="Lab">Laboratory</SelectItem>
                        <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">
                      Organization Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder="ORG-001"
                      required
                      disabled={isSubmitting}
                      showInfoIcon
                      aria-label="Enter unique organization code"
                    />
                    <p id="code-help" className="text-xs text-neutral-500">
                      Unique identifier for this organization (e.g., ORG-001)
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">
                      Organization Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Organization name"
                      required
                      disabled={isSubmitting}
                      showInfoIcon
                      aria-label="Enter full organization name"
                    />
                    <p id="name-help" className="text-xs text-neutral-500">
                      Full legal name of the organization
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Full address"
                      required
                      disabled={isSubmitting}
                      showInfoIcon
                      aria-label="Enter complete physical address"
                    />
                    <p id="address-help" className="text-xs text-neutral-500">
                      Complete physical address including street, city, and postal code
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">
                      Contact Information <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="Phone / Email"
                      required
                      disabled={isSubmitting}
                      showInfoIcon
                      aria-label="Enter primary contact phone or email"
                    />
                    <p id="contact-help" className="text-xs text-neutral-500">
                      Primary phone number or email address for this organization
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="is_active" name="is_active" value="true" defaultChecked />
                    <Label htmlFor="is_active" className="text-body-medium">
                      Active
                    </Label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={isSubmitting}
                    aria-label="Cancel creating organization"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Creating organization, please wait" : "Create new organization"}
                  >
                    {isSubmitting ? "Creating..." : "Create Organization"}
                  </Button>
                </div>
              </Form>

              {actionData && !actionData.success && 'error' in actionData && (
                <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                  {actionData.error}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Organizations List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((org) => (
            <Card key={org.id} className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 border ${getTypeBadgeClass(org.type)}`}>
                      {getOrgIcon(org.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-900">
                        {org.name}
                      </h3>
                      <p className="text-sm text-slate-500">{org.code}</p>
                    </div>
                  </div>
                  {org.is_active && (
                    <span className="rounded-full bg-green-50 border border-green-200 px-2 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[60px]">Type:</span>
                    <span>{org.type}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[60px]">Address:</span>
                    <span className="flex-1">{org.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[60px]">Contact:</span>
                    <span>{org.contact}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Building2 className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(org.code)}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Manage Staff
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Compliance
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={org.id} />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-700 focus:bg-red-50"
                          onSelect={(e) => {
                            e.preventDefault();
                            if (confirm(`Are you sure you want to delete ${org.name}?`)) {
                              const target = e.target as HTMLElement;
                              const form = target.closest('form');
                              form?.requestSubmit();
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Organization
                        </DropdownMenuItem>
                      </Form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="py-12 text-center">
              <Building2 className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg font-medium text-slate-700 mb-1">
                No organizations found
              </p>
              <p className="text-sm text-slate-500">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your filters"
                  : "Click 'Add Organization' to create one"}
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
