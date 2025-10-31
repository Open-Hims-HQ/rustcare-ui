import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Plus, Edit, UserCheck, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
    { title: "Healthcare Providers - RustCare Admin" },
    { name: "description", content: "Manage healthcare providers and their service assignments" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Fetch providers from API
  const providers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      license_number: 'MD-12345',
      license_state: 'CA',
      specialty: 'Cardiology',
      npi: '1234567890',
      department: 'Cardiology',
      is_active: true,
      services_count: 15,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      license_number: 'MD-67890',
      license_state: 'NY',
      specialty: 'General Practice',
      npi: '0987654321',
      department: 'Primary Care',
      is_active: true,
      services_count: 8,
    },
  ];

  return json({ providers });
}

export default function ProvidersPage() {
  const { providers } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Healthcare Providers
            </h1>
            <p className="text-gray-600 mt-2 text-base">
              Manage providers and their service offerings
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Provider
          </Button>
        </div>
      </div>

      {/* Providers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Providers</CardTitle>
              <CardDescription>
                {providers.length} active providers
              </CardDescription>
            </div>
            <Input
              placeholder="Search providers..."
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>License</TableHead>
                <TableHead>NPI</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-semibold">{provider.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{provider.specialty}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {provider.license_number} ({provider.license_state})
                  </TableCell>
                  <TableCell className="font-mono text-sm">{provider.npi}</TableCell>
                  <TableCell>{provider.department}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">
                      {provider.services_count} services
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {provider.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold">{providers.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Specialties</p>
                <p className="text-2xl font-bold">
                  {new Set(providers.map(p => p.specialty)).size}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">
                  {providers.reduce((sum, p) => sum + p.services_count, 0)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

