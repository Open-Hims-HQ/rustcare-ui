import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Building2, Hospital, FlaskConical, Pill, Plus, Search, Pencil, Trash2 } from "lucide-react";
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

// Organization type definition
export interface Organization {
  id: string;
  name: string;
  code: string;
  type: "hospital" | "clinic" | "lab" | "pharmacy";
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
    case "hospital":
      return <Hospital className="h-5 w-5" />;
    case "clinic":
      return <Building2 className="h-5 w-5" />;
    case "lab":
      return <FlaskConical className="h-5 w-5" />;
    case "pharmacy":
      return <Pill className="h-5 w-5" />;
  }
}

// Organization type badge colors
function getTypeBadgeClass(type: Organization["type"]) {
  switch (type) {
    case "hospital":
      return "bg-error/10 text-error";
    case "clinic":
      return "bg-primary/10 text-primary";
    case "lab":
      return "bg-tertiary/10 text-tertiary";
    case "pharmacy":
      return "bg-secondary/10 text-secondary";
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
    hospitals: organizations.filter(o => o.type === "hospital").length,
    clinics: organizations.filter(o => o.type === "clinic").length,
    labs: organizations.filter(o => o.type === "lab").length,
    pharmacies: organizations.filter(o => o.type === "pharmacy").length,
    active: organizations.filter(o => o.is_active).length,
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface-container px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-small font-normal text-on-surface">Organizations</h1>
            <p className="text-body-medium text-on-surface-variant">
              Manage hospitals, clinics, labs, and pharmacies
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Organization
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-label-small text-on-surface-variant">Total</div>
              <div className="text-display-small font-normal text-on-surface">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-label-small text-on-surface-variant">
                <Hospital className="h-4 w-4" />
                Hospitals
              </div>
              <div className="text-display-small font-normal text-on-surface">{stats.hospitals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-label-small text-on-surface-variant">
                <Building2 className="h-4 w-4" />
                Clinics
              </div>
              <div className="text-display-small font-normal text-on-surface">{stats.clinics}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-label-small text-on-surface-variant">
                <FlaskConical className="h-4 w-4" />
                Labs
              </div>
              <div className="text-display-small font-normal text-on-surface">{stats.labs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-label-small text-on-surface-variant">
                <Pill className="h-4 w-4" />
                Pharmacies
              </div>
              <div className="text-display-small font-normal text-on-surface">{stats.pharmacies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-label-small text-on-surface-variant">Active</div>
              <div className="text-display-small font-normal text-on-surface">{stats.active}</div>
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
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "filled" : "outlined"}
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button
              variant={filterType === "hospital" ? "filled" : "outlined"}
              onClick={() => setFilterType("hospital")}
            >
              <Hospital className="mr-2 h-4 w-4" />
              Hospitals
            </Button>
            <Button
              variant={filterType === "clinic" ? "filled" : "outlined"}
              onClick={() => setFilterType("clinic")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Clinics
            </Button>
            <Button
              variant={filterType === "lab" ? "filled" : "outlined"}
              onClick={() => setFilterType("lab")}
            >
              <FlaskConical className="mr-2 h-4 w-4" />
              Labs
            </Button>
            <Button
              variant={filterType === "pharmacy" ? "filled" : "outlined"}
              onClick={() => setFilterType("pharmacy")}
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
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="lab">Laboratory</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder="ORG-001"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Organization name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Full address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="Phone / Email"
                      required
                      disabled={isSubmitting}
                    />
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
                    variant="outlined"
                    onClick={() => setShowAddForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Organization"}
                  </Button>
                </div>
              </Form>

              {actionData && !actionData.success && (
                <div className="mt-4 rounded-md bg-error/10 p-3 text-body-small text-error">
                  {actionData.error}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Organizations List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((org) => (
            <Card key={org.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${getTypeBadgeClass(org.type)}`}>
                      {getOrgIcon(org.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-title-medium font-medium text-on-surface">
                        {org.name}
                      </h3>
                      <p className="text-body-small text-on-surface-variant">{org.code}</p>
                    </div>
                  </div>
                  {org.is_active && (
                    <span className="rounded-full bg-tertiary/10 px-2 py-1 text-label-small text-tertiary">
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-body-small text-on-surface-variant">
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Type:</span>
                    <span className="capitalize">{org.type}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Address:</span>
                    <span className="flex-1">{org.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">Contact:</span>
                    <span>{org.contact}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outlined" size="sm" className="flex-1">
                    <Pencil className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Form method="post" className="flex-1">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={org.id} />
                    <Button
                      type="submit"
                      variant="outlined"
                      size="sm"
                      className="w-full text-error hover:bg-error/10"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </Button>
                  </Form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="mx-auto mb-4 h-12 w-12 text-on-surface-variant/50" />
              <p className="text-body-large text-on-surface-variant">
                No organizations found
              </p>
              <p className="text-body-small text-on-surface-variant">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your filters"
                  : "Click 'Add Organization' to create one"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
