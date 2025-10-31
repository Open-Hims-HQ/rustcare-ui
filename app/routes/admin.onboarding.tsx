import { json, type LoaderFunctionArgs, type MetaFunction, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { UserPlus, Mail, Key, CheckCircle, AlertCircle, Building2, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const meta: MetaFunction = () => {
  return [
    { title: "Hospital Onboarding - RustCare Admin" },
    { name: "description", content: "Onboard new hospitals and create user accounts" },
  ];
};

// Loader: Mock data for organizations
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // TODO: Fetch from actual API
    const organizations = [
      {
        id: 'org-001',
        name: 'Demo Hospital',
        slug: 'demo-hospital',
        type: 'Hospital',
      },
      {
        id: 'org-002',
        name: 'City Medical Center',
        slug: 'city-medical-center',
        type: 'Clinic',
      },
    ];

    return json({ organizations, isMockData: true });
  } catch (error) {
    console.error('Error loading organizations:', error);
    return json({ organizations: [], isMockData: true });
  }
}

export default function OnboardingPage() {
  const { organizations, isMockData } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'staff',
    organizationId: '',
    sendCredentials: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call
    console.log('Creating user:', formData);
    alert('User created successfully!');
    navigate('/admin/users');
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Hospital Onboarding
          </h1>
        </div>
        <p className="text-gray-600 text-base">
          Create user accounts, send credentials, and onboard new hospitals
        </p>
      </div>

      {/* Mock Data Warning */}
      {isMockData && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Development Mode</p>
              <p className="text-sm text-yellow-700">Showing demo data. Backend API not connected.</p>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New User Account</CardTitle>
          <CardDescription>
            Send welcome credentials to new hospital staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Selection */}
            <div className="space-y-2">
              <Label htmlFor="organizationId">Organization</Label>
              <select
                id="organizationId"
                name="organizationId"
                required
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Organization...</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.type})
                  </option>
                ))}
              </select>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@hospital.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">Administrator</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
                <option value="receptionist">Receptionist</option>
                <option value="pharmacist">Pharmacist</option>
              </select>
            </div>

            {/* Email Options */}
            <div className="flex items-center space-x-2 border rounded-lg p-4 bg-blue-50">
              <input
                type="checkbox"
                id="sendCredentials"
                checked={formData.sendCredentials}
                onChange={(e) => setFormData({ ...formData, sendCredentials: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <Label htmlFor="sendCredentials" className="font-medium">
                  Send credentials via email
                </Label>
                <p className="text-sm text-gray-600">
                  A temporary password will be emailed to the user
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>
                Cancel
              </Button>
              <Button type="submit" className="shadow-md">
                <Mail className="h-4 w-4 mr-2" />
                Create User & Send Credentials
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Existing Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-600">Active accounts</p>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              View All Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Mail className="h-4 w-4 mr-2 text-green-500" />
              Credentials Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <p className="text-sm text-gray-600">This month</p>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              View History
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-purple-500" />
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{organizations.length}</div>
            <p className="text-sm text-gray-600">Active hospitals</p>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              Manage Organizations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Automatic Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Generate secure temporary passwords
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Send professional welcome emails
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Configure role-based permissions
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Audit logging for compliance
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Key className="h-5 w-5 mr-2 text-blue-500" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Argon2id password hashing
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Force password change on first login
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Email verification required
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                HIPAA compliant audit trail
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

