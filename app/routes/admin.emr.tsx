import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { FileText, Plus, Edit, Eye, Activity } from "lucide-react";
import { organizationsApi } from "~/lib/api.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import EMRRecordFlow from "~/components/emr/EMRRecordFlow";

export const meta: MetaFunction = () => {
  return [
    { title: "EMR Records - RustCare Admin" },
    { name: "description", content: "Manage Electronic Medical Records with interactive flow visualization" },
  ];
};

// Loader: Fetch organizations to get patients from
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const organizations = await organizationsApi.list();
    return json({ organizations });
  } catch (error) {
    // If backend is not available, return mock data for development
    console.warn('Backend not available, using mock data:', error);
    const organizations = [
      {
        id: 'demo-org-001',
        name: 'Demo Hospital',
        code: 'DEMO-HOSP',
        type: 'Hospital',
        address: '123 Medical Center Dr',
        contact: 'contact@demo-hospital.com',
        is_active: true,
      }
    ];
    return json({ organizations, isMockData: true });
  }
}

export default function EMRRecordsPage() {
  const { organizations, isMockData } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">
          Electronic Medical Records
        </h1>
        <p className="text-gray-600 mt-2 text-base">
          View and manage patient records with interactive workflow visualization
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>EMR Visualization</CardTitle>
          <CardDescription>
            Interactive timeline of patient medical records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isMockData && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Development Mode:</strong> Backend not connected. Showing demo data.
              </p>
            </div>
          )}
          <div className="border rounded-lg overflow-hidden">
            <EMRRecordFlow 
              orgId={organizations[0]?.id}
              viewMode="timeline"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <Plus className="h-6 w-6" />
              <span>New Record</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <FileText className="h-6 w-6" />
              <span>View All Records</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6">
              <Activity className="h-6 w-6" />
              <span>Workflow Dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

