import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Receipt, DollarSign, TrendingUp, AlertCircle, Plus, Search } from "lucide-react";

export const meta = () => {
  return [
    { title: "Billing Dashboard | RustCare Admin" },
    { name: "description", content: "Manage billing charges and revenue cycle" },
  ];
};

export const loader = async () => {
  // Mock data - replace with actual API call
  const charges = [
    {
      id: "1",
      encounterId: "ENC-001",
      patientId: "P-001",
      patientName: "John Doe",
      providerId: "PRV-001",
      providerName: "Dr. Smith",
      serviceCode: "99213",
      description: "Office Visit - Level 3",
      quantity: 1,
      unitPrice: 150.00,
      totalAmount: 150.00,
      status: "billed",
      billTo: "Insurance",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      encounterId: "ENC-002",
      patientId: "P-002",
      patientName: "Jane Smith",
      providerId: "PRV-002",
      providerName: "Dr. Johnson",
      serviceCode: "99214",
      description: "Office Visit - Level 4",
      quantity: 1,
      unitPrice: 220.00,
      totalAmount: 220.00,
      status: "paid",
      billTo: "Patient",
      createdAt: "2024-01-14T14:20:00Z",
    },
    {
      id: "3",
      encounterId: "ENC-003",
      patientId: "P-003",
      patientName: "Bob Wilson",
      providerId: "PRV-001",
      providerName: "Dr. Smith",
      serviceCode: "36415",
      description: "Blood Draw",
      quantity: 1,
      unitPrice: 25.00,
      totalAmount: 25.00,
      status: "denied",
      billTo: "Insurance",
      createdAt: "2024-01-13T09:15:00Z",
    },
  ];

  const summary = {
    totalRevenue: 45250.00,
    collections: 38900.00,
    outstanding: 4250.00,
    denied: 2100.00,
    pending: 0.00,
    thisMonth: 12500.00,
    lastMonth: 33250.00,
  };

  return { charges, summary };
};

export default function BillingDashboard() {
  const { charges, summary } = useLoaderData<typeof loader>();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      billed: "secondary",
      paid: "default",
      denied: "destructive",
      pending: "secondary",
      writtenOff: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6" id="billing-dashboard-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" id="billing-page-title">Billing Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage charges, revenue cycle, and billing operations
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Capture Charge
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" id="billing-summary-stats">
          <Card id="billing-stat-total-revenue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time revenue</p>
            </CardContent>
          </Card>

          <Card id="billing-stat-collections">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${summary.collections.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {((summary.collections / summary.totalRevenue) * 100).toFixed(1)}% collection rate
              </p>
            </CardContent>
          </Card>

          <Card id="billing-stat-outstanding">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${summary.outstanding.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Pending collection</p>
            </CardContent>
          </Card>

          <Card id="billing-stat-denied">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denied</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${summary.denied.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Needs appeal</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Charges</TabsTrigger>
            <TabsTrigger value="billed">Billed</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card id="billing-charges-table-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Charges</CardTitle>
                    <CardDescription>
                      Recent billing charges and their status
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search charges..." className="pl-8 w-[300px]" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table id="billing-charges-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Charge #</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bill To</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {charges.map((charge) => (
                      <TableRow key={charge.id} id={`billing-charge-${charge.id}`}>
                        <TableCell className="font-medium">{charge.id}</TableCell>
                        <TableCell>{charge.patientName}</TableCell>
                        <TableCell>{charge.providerName}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{charge.serviceCode}</div>
                            <div className="text-xs text-muted-foreground">
                              {charge.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${charge.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>{getStatusBadge(charge.status)}</TableCell>
                        <TableCell>{charge.billTo}</TableCell>
                        <TableCell>
                          {new Date(charge.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billed">
            <Card>
              <CardHeader>
                <CardTitle>Billed Charges</CardTitle>
                <CardDescription>Charges that have been billed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Billed charges will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid">
            <Card>
              <CardHeader>
                <CardTitle>Paid Charges</CardTitle>
                <CardDescription>Charges that have been paid</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Paid charges will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="denied">
            <Card>
              <CardHeader>
                <CardTitle>Denied Charges</CardTitle>
                <CardDescription>Charges that were denied and need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Denied charges will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Charges</CardTitle>
                <CardDescription>Charges awaiting processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Pending charges will appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}

