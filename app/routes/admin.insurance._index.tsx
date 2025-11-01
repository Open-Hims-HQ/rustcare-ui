import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Shield, CreditCard, Phone, Mail, Globe, Plus, Edit, CheckCircle } from "lucide-react";

export const meta = () => {
  return [
    { title: "Insurance Providers | RustCare Admin" },
    { name: "description", content: "Manage insurance providers and their information" },
  ];
};

export const loader = async () => {
  const providers = [
    {
      id: "1",
      name: "BlueCross BlueShield",
      payerId: "BCBS",
      type: "Commercial",
      state: "National",
      isActive: true,
      contact: {
        phone: "1-800-555-0100",
        email: "support@bcbs.com",
        website: "www.bcbs.com",
        address: "123 Insurance Ave, Chicago, IL 60601",
      },
      edi: {
        claimSubmission: "837P/837I",
        eligibility: "270/271",
        remittance: "835",
        clearinghouse: "Availity",
        payerId: "12345",
      },
      claims: {
        supported: true,
        autoSubmission: true,
        paperClaims: false,
        timelyFilingDays: 90,
      },
    },
    {
      id: "2",
      name: "Aetna",
      payerId: "AET",
      type: "Commercial",
      state: "National",
      isActive: true,
      contact: {
        phone: "1-800-555-0200",
        email: "provider@aetna.com",
        website: "www.aetna.com",
        address: "151 Farmington Ave, Hartford, CT 06156",
      },
      edi: {
        claimSubmission: "837P/837I",
        eligibility: "270/271",
        remittance: "835",
        clearinghouse: "Availity",
        payerId: "23456",
      },
      claims: {
        supported: true,
        autoSubmission: true,
        paperClaims: false,
        timelyFilingDays: 90,
      },
    },
    {
      id: "3",
      name: "Medicare",
      payerId: "MC",
      type: "Federal",
      state: "National",
      isActive: true,
      contact: {
        phone: "1-800-MEDICARE",
        email: "medicare@cms.hhs.gov",
        website: "www.medicare.gov",
        address: "7500 Security Blvd, Baltimore, MD 21244",
      },
      edi: {
        claimSubmission: "837P/837I",
        eligibility: "270/271",
        remittance: "835",
        clearinghouse: "NGS",
        payerId: "34567",
      },
      claims: {
        supported: true,
        autoSubmission: true,
        paperClaims: false,
        timelyFilingDays: 365,
      },
    },
    {
      id: "4",
      name: "Medicaid Texas",
      payerId: "TXMD",
      type: "State",
      state: "Texas",
      isActive: true,
      contact: {
        phone: "1-800-555-0400",
        email: "provider@hhs.texas.gov",
        website: "www.hhs.texas.gov",
        address: "4900 N Lamar Blvd, Austin, TX 78751",
      },
      edi: {
        claimSubmission: "837P",
        eligibility: "270/271",
        remittance: "835",
        clearinghouse: "Imagenet",
        payerId: "45678",
      },
      claims: {
        supported: true,
        autoSubmission: true,
        paperClaims: false,
        timelyFilingDays: 365,
      },
    },
  ];

  return { providers };
};

export default function InsuranceProviders() {
  const { providers } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6 space-y-6" id="insurance-providers-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" id="insurance-providers-title">Insurance Providers</h1>
          <p className="text-muted-foreground mt-1">
            Manage insurance payers and their configuration
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      <Table id="insurance-providers-table">
        <TableHeader>
          <TableRow>
            <TableHead>Provider Name</TableHead>
            <TableHead>Payer ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>EDI Info</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id} id={`insurance-provider-${provider.id}`}>
              <TableCell className="font-medium">{provider.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{provider.payerId}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{provider.type}</Badge>
              </TableCell>
              <TableCell>{provider.state}</TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{provider.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{provider.contact.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-xs">
                  <div>Clearinghouse: {provider.edi.clearinghouse}</div>
                  <div>Payer ID: {provider.edi.payerId}</div>
                  <div className="text-muted-foreground">
                    Claims: {provider.claims.timelyFilingDays} days
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {provider.isActive ? (
                  <Badge className="bg-green-600">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Provider Details Modal would go here */}
    </div>
  );
}

