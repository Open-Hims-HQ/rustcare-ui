import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Plus, Building2, Package, Star, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

export const meta: MetaFunction = () => {
  return [
    { title: "Vendor Management - RustCare Admin" },
    { name: "description", content: "Manage external vendors and their services" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Fetch vendor data from API
  const vendors = [
    {
      id: '1',
      name: 'LabCorp External Labs',
      type: 'External Laboratory',
      code: 'LAB-001',
      category: 'services',
      phone: '(555) 123-4567',
      email: 'contact@labcorp.com',
      rating: 4.5,
      is_preferred: true,
      is_active: true,
      services_count: 25,
      inventory_count: 150,
    },
    {
      id: '2',
      name: 'MedEquip Rentals',
      type: 'Equipment Rental',
      code: 'EQUIP-001',
      category: 'equipment',
      phone: '(555) 987-6543',
      email: 'rentals@medequip.com',
      rating: 4.2,
      is_preferred: false,
      is_active: true,
      services_count: 12,
      inventory_count: 50,
    },
  ];

  const vendorTypes = [
    { code: 'lab_external', name: 'External Laboratory', count: 15 },
    { code: 'equipment_rental', name: 'Medical Equipment Rental', count: 8 },
    { code: 'imaging_center', name: 'Imaging Center', count: 5 },
    { code: 'it_services', name: 'IT Services Provider', count: 12 },
  ];

  return json({ vendors, vendorTypes });
}

export default function VendorsPage() {
  const { vendors, vendorTypes } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Vendor Management
            </h1>
            <p className="text-gray-600 mt-2 text-base">
              Manage external vendors, inventory, and service catalogs
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Package className="h-5 w-5" />
              Vendor Types
            </Button>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Vendor
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">
            <Building2 className="mr-2 h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="types">
            <Package className="mr-2 h-4 w-4" />
            Vendor Types
          </TabsTrigger>
        </TabsList>

        {/* Vendors Tab */}
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>External Vendors</CardTitle>
                  <CardDescription>
                    {vendors.length} active vendors
                  </CardDescription>
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {vendor.name}
                            {vendor.is_preferred && (
                              <Badge className="bg-blue-100 text-blue-800">Preferred</Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{vendor.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {vendor.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {vendor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{vendor.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {vendor.services_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vendor.inventory_count}</Badge>
                      </TableCell>
                      <TableCell>
                        {vendor.is_active ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Types Tab */}
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Types</CardTitle>
              <CardDescription>
                Manage vendor type classifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Vendors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorTypes.map((type) => (
                    <TableRow key={type.code}>
                      <TableCell className="font-semibold">{type.name}</TableCell>
                      <TableCell className="font-mono text-sm">{type.code}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{type.count}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preferred</p>
                <p className="text-2xl font-bold">
                  {vendors.filter(v => v.is_preferred).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">
                  {vendors.reduce((sum, v) => sum + v.services_count, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

