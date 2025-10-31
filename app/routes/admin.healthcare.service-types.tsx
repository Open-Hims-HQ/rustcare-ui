import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Plus, Edit, Trash2, Search, Filter, Settings, Activity } from "lucide-react";
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
import {
  Badge
} from "~/components/ui/badge";

export const meta: MetaFunction = () => {
  return [
    { title: "Service Types - RustCare Admin" },
    { name: "description", content: "Manage healthcare service types and catalog" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Fetch service types from API
  const serviceTypes = [
    {
      id: '1',
      code: 'CONSULT_GENERAL',
      name: 'General Consultation',
      description: 'General medical consultation',
      category: 'consultation',
      classification: 'primary_care',
      urgency: 'routine',
      complexity: 'moderate',
      risk: 'low',
      typical_duration: '0.5 hours',
      requires_licensure: true,
      is_active: true,
      cpt_code: '99213',
    },
    {
      id: '2',
      code: 'LAB_BLOOD_WORK',
      name: 'Blood Work',
      description: 'Comprehensive blood panel',
      category: 'testing',
      classification: 'diagnostic',
      urgency: 'routine',
      complexity: 'simple',
      risk: 'low',
      typical_duration: '0.25 hours',
      requires_licensure: false,
      is_active: true,
      cpt_code: '80053',
    },
    {
      id: '3',
      code: 'PROC_MINOR',
      name: 'Minor Procedure',
      description: 'Simple outpatient procedure',
      category: 'procedure',
      classification: 'specialty',
      urgency: 'routine',
      complexity: 'moderate',
      risk: 'moderate',
      typical_duration: '1.0 hours',
      requires_licensure: true,
      is_active: true,
      cpt_code: '10021',
    },
  ];

  return json({ serviceTypes });
}

export default function ServiceTypesPage() {
  const { serviceTypes } = useLoaderData<typeof loader>();

  const getBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      consultation: 'bg-blue-100 text-blue-800',
      testing: 'bg-green-100 text-green-800',
      procedure: 'bg-purple-100 text-purple-800',
      treatment: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Service Types Catalog
            </h1>
            <p className="text-gray-600 mt-2 text-base">
              Manage your healthcare service catalog with dynamic service types
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Service Type
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search service types..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Types Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service Types</CardTitle>
              <CardDescription>
                {serviceTypes.length} service types available
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Complexity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceTypes.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-mono text-sm">{service.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-xs text-gray-500">{service.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeColor(service.category)}>
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.classification}</TableCell>
                  <TableCell>{service.typical_duration}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.urgency}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.complexity}</Badge>
                  </TableCell>
                  <TableCell>
                    {service.is_active ? (
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
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{serviceTypes.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{serviceTypes.filter(s => s.is_active).length}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">✓</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{new Set(serviceTypes.map(s => s.category)).size}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requires License</p>
                <p className="text-2xl font-bold">{serviceTypes.filter(s => s.requires_licensure).length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

