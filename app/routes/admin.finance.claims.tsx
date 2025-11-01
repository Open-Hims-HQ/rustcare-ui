import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FileText, CheckCircle2, XCircle, Clock, Send, Plus } from "lucide-react";

export const meta = () => {
  return [
    { title: "Claims Management | RustCare Admin" },
    { name: "description", content: "Manage insurance claims and submissions" },
  ];
};

export const loader = async () => {
  const claims = [
    {
      id: "1",
      claimNumber: "CLM-001",
      patientId: "P-001",
      patientName: "John Doe",
      insuranceId: "INS-001",
      insuranceName: "BlueCross BlueShield",
      providerId: "PRV-001",
      providerName: "Dr. Smith",
      claimType: "Professional",
      totalAmount: 150.00,
      status: "submitted",
      submissionDate: "2024-01-15T10:00:00Z",
      remittanceDate: null,
    },
    {
      id: "2",
      claimNumber: "CLM-002",
      patientId: "P-002",
      patientName: "Jane Smith",
      insuranceId: "INS-002",
      insuranceName: "Aetna",
      providerId: "PRV-002",
      providerName: "Dr. Johnson",
      claimType: "Professional",
      totalAmount: 220.00,
      status: "paid",
      submissionDate: "2024-01-10T09:30:00Z",
      remittanceDate: "2024-01-14T11:00:00Z",
    },
    {
      id: "3",
      claimNumber: "CLM-003",
      patientId: "P-003",
      patientName: "Bob Wilson",
      insuranceId: "INS-001",
      insuranceName: "BlueCross BlueShield",
      providerId: "PRV-001",
      providerName: "Dr. Smith",
      claimType: "Institutional",
      totalAmount: 1250.00,
      status: "denied",
      submissionDate: "2024-01-08T14:20:00Z",
      remittanceDate: "2024-01-12T10:15:00Z",
    },
  ];

  const summary = {
    total: 25,
    submitted: 10,
    processing: 5,
    paid: 7,
    denied: 3,
    thisMonth: 45000.00,
    lastMonth: 82000.00,
  };

  return { claims, summary };
};

export default function ClaimsManagement() {
  const { claims, summary } = useLoaderData<typeof loader>();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      submitted: "secondary",
      processing: "secondary",
      accepted: "default",
      denied: "destructive",
      paid: "default",
      appealed: "secondary",
    };

    const icons = {
      draft: Clock,
      submitted: Send,
      processing: Clock,
      accepted: CheckCircle2,
      denied: XCircle,
      paid: CheckCircle2,
      appealed: Clock,
    };

    const Icon = icons[status] || Clock;

    return (
      <Badge variant={variants[status] || "outline"} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6" id="claims-dashboard-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" id="claims-page-title">Claims Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage insurance claims and track submission status
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Claim
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.denied}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Claims</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="denied">Denied</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Claims</CardTitle>
              <CardDescription>Insurance claims and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                      <TableCell>{claim.patientName}</TableCell>
                      <TableCell>{claim.insuranceName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{claim.claimType}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${claim.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(claim.status)}</TableCell>
                      <TableCell>
                        {claim.submissionDate
                          ? new Date(claim.submissionDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submitted">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Claims</CardTitle>
              <CardDescription>Claims that have been submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Submitted claims will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Processing Claims</CardTitle>
              <CardDescription>Claims being processed by insurance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Processing claims will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Paid Claims</CardTitle>
              <CardDescription>Claims that have been paid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Paid claims will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="denied">
          <Card>
            <CardHeader>
              <CardTitle>Denied Claims</CardTitle>
              <CardDescription>Claims that were denied and need review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Denied claims will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
