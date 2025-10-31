import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { FileText, Plus, Edit, Eye, Activity } from "lucide-react";
import { organizationsApi } from "~/lib/api.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import EMRRecordFlow from "~/components/emr/EMRRecordFlow";
import ClinicalChart from "~/components/emr/ClinicalChart";

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
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Electronic Medical Records
              </h1>
            </div>
            <p className="text-gray-600 text-base">
              View and manage patient records with interactive workflow visualization
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="h-4 w-4 mr-2" />
              New Record
            </Button>
          </div>
        </div>
      </div>

      {/* Clinical Chart - Epic/Cerner Style */}
      <div className="bg-white rounded-lg shadow-sm border">
        {isMockData && (
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Development Mode:</strong> Backend not connected. Showing demo data.
            </p>
          </div>
        )}
        <ClinicalChart 
          patientId="PAT-001"
          patientName="John Doe"
          patientInfo={{
            age: 45,
            dateOfBirth: "1978-05-15",
            gender: "Male",
            mrn: "MRN-001"
          }}
        />
      </div>

      {/* Workflow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline View</CardTitle>
          <CardDescription>
            Interactive timeline of patient medical records
          </CardDescription>
        </CardHeader>
        <CardContent>
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

