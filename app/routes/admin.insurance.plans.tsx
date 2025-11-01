import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Shield, Activity, FileText, CheckCircle2, XCircle, Clock, Plus } from "lucide-react";

export const meta = () => {
  return [
    { title: "Insurance Management | RustCare Admin" },
    { name: "description", content: "Manage insurance plans and eligibility" },
  ];
};

export const loader = async () => {
  const plans = [
    {
      id: "1",
      name: "BlueCross BlueShield Gold",
      payerId: "BCBS-001",
      payerName: "BlueCross BlueShield",
      planType: "Commercial",
      effectiveDate: "2024-01-01T00:00:00Z",
      terminationDate: null,
      isActive: true,
      deductible: 1500.00,
      outOfPocketMax: 5000.00,
      copayPrimary: 25.00,
      copaySpecialist: 50.00,
      coinsurance: 0.20,
    },
    {
      id: "2",
      name: "Aetna Silver Plan",
      payerId: "AET-001",
      payerName: "Aetna",
      planType: "Commercial",
      effectiveDate: "2024-01-01T00:00:00Z",
      terminationDate: null,
      isActive: true,
      deductible: 2000.00,
      outOfPocketMax: 6000.00,
      copayPrimary: 30.00,
      copaySpecialist: 60.00,
      coinsurance: 0.30,
    },
  ];

  const authorizations = [
    {
      id: "1",
      patientId: "P-001",
      patientName: "John Doe",
      insuranceId: "INS-001",
      insuranceName: "BlueCross BlueShield",
      providerId: "PRV-001",
      providerName: "Dr. Smith",
      serviceCode: "29881",
      description: "Knee arthroscopy with meniscectomy",
      requestedDate: "2024-01-15T10:00:00Z",
      status: "approved",
      authNumber: "AUTH-12345",
      effectiveDate: "2024-01-15T00:00:00Z",
      expiryDate: "2024-04-15T00:00:00Z",
    },
    {
      id: "2",
      patientId: "P-002",
      patientName: "Jane Smith",
      insuranceId: "INS-002",
      insuranceName: "Aetna",
      providerId: "PRV-002",
      providerName: "Dr. Johnson",
      serviceCode: "45378",
      description: "Colonoscopy with biopsy",
      requestedDate: "2024-01-14T14:30:00Z",
      status: "pending",
      authNumber: null,
      effectiveDate: null,
      expiryDate: null,
    },
  ];

  return { plans, authorizations };
};

export default function InsuranceManagement() {
  const { plans, authorizations } = useLoaderData<typeof loader>();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      denied: "destructive",
      partiallyApproved: "secondary",
      expired: "outline",
    };

    const icons = {
      pending: Clock,
      approved: CheckCircle2,
      denied: XCircle,
      partiallyApproved: Clock,
      expired: XCircle,
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
    <div className="container mx-auto p-6 space-y-6" id="insurance-dashboard-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" id="insurance-page-title">Insurance Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage insurance plans, eligibility, and authorizations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Insurance Plans</TabsTrigger>
          <TabsTrigger value="authorizations">Prior Authorizations</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Plans</CardTitle>
              <CardDescription>Registered insurance plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Deductible</TableHead>
                    <TableHead>OOP Max</TableHead>
                    <TableHead>Copay (P/S)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.payerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.planType}</Badge>
                      </TableCell>
                      <TableCell>${plan.deductible.toFixed(2)}</TableCell>
                      <TableCell>${plan.outOfPocketMax.toFixed(2)}</TableCell>
                      <TableCell>
                        ${plan.copayPrimary}/${plan.copaySpecialist}
                      </TableCell>
                      <TableCell>
                        {plan.isActive ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authorizations">
          <Card>
            <CardHeader>
              <CardTitle>Prior Authorizations</CardTitle>
              <CardDescription>Authorization requests and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Auth #</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authorizations.map((auth) => (
                    <TableRow key={auth.id}>
                      <TableCell className="font-medium">{auth.patientName}</TableCell>
                      <TableCell>{auth.insuranceName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{auth.serviceCode}</div>
                          <div className="text-xs text-muted-foreground">{auth.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{auth.providerName}</TableCell>
                      <TableCell>
                        {new Date(auth.requestedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(auth.status)}</TableCell>
                      <TableCell>
                        {auth.authNumber || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
