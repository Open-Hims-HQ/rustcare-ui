import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Plus, Package, Pill, FileText, AlertTriangle } from "lucide-react";
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
    { title: "Pharmacy Management - RustCare Admin" },
    { name: "description", content: "Manage pharmacy inventory and prescriptions" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Fetch pharmacy data from API
  const inventory = [
    {
      id: '1',
      medication: 'Aspirin 81mg',
      quantity: 150,
      location: 'Main Pharmacy',
      expiry: '2025-12-31',
      reorder_level: 100,
    },
    {
      id: '2',
      medication: 'Metformin 500mg',
      quantity: 45,
      location: 'Main Pharmacy',
      expiry: '2025-06-30',
      reorder_level: 50,
    },
  ];

  const prescriptions = [
    {
      id: '1',
      patient: 'John Doe',
      medication: 'Aspirin 81mg',
      provider: 'Dr. Sarah Johnson',
      status: 'pending',
      prescribed_date: '2024-10-30',
    },
  ];

  return json({ inventory, prescriptions });
}

export default function PharmacyPage() {
  const { inventory, prescriptions } = useLoaderData<typeof loader>();

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity <= reorderLevel * 0.5) return { status: 'critical', color: 'bg-red-100 text-red-800' };
    if (quantity <= reorderLevel) return { status: 'low', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'good', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Pharmacy Management
            </h1>
            <p className="text-gray-600 mt-2 text-base">
              Manage medications, inventory, and prescriptions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Plus className="h-5 w-5" />
              Add Medication
            </Button>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              New Prescription
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">
            <Package className="mr-2 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <FileText className="mr-2 h-4 w-4" />
            Prescriptions
          </TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medication Inventory</CardTitle>
                  <CardDescription>
                    {inventory.length} medications tracked
                  </CardDescription>
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const stock = getStockStatus(item.quantity, item.reorder_level);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-semibold">{item.medication}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {item.quantity} units
                          </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="font-mono text-sm">{item.expiry}</TableCell>
                        <TableCell>
                          <Badge className={stock.color}>
                            {stock.status === 'critical' && <AlertTriangle className="mr-1 h-3 w-3" />}
                            {stock.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prescriptions</CardTitle>
                  <CardDescription>
                    {prescriptions.length} active prescriptions
                  </CardDescription>
                </div>
                <Button variant="outline">Filter</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-semibold">{prescription.patient}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-purple-600" />
                          {prescription.medication}
                        </div>
                      </TableCell>
                      <TableCell>{prescription.provider}</TableCell>
                      <TableCell className="font-mono text-sm">{prescription.prescribed_date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{prescription.status}</Badge>
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
      </Tabs>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Medications</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Pill className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">
                  {inventory.filter(i => i.quantity <= i.reorder_level).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Prescriptions</p>
                <p className="text-2xl font-bold">{prescriptions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {prescriptions.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

