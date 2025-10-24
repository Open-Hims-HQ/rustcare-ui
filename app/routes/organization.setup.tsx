import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";

export const meta: MetaFunction = () => {
  return [
    { title: "Organization Setup - RustCare Admin" },
    { name: "description", content: "Set up your healthcare organization with compliance and geographic settings" },
  ];
};

interface GeographicRegion {
  id: string;
  name: string;
  code: string;
  region_type: string;
  path: string;
}

interface ComplianceFramework {
  id: string;
  name: string;
  code: string;
  version: string;
  jurisdiction: string;
  description?: string;
}

interface OrganizationSetup {
  name: string;
  organization_type: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  timezone: string;
  license_number: string;
  license_authority: string;
  license_valid_until: string;
  auto_assign_compliance: boolean;
}

const ORGANIZATION_TYPES = [
  { value: "clinic", label: "Clinic", description: "Primary care or specialty clinic" },
  { value: "hospital", label: "Hospital", description: "Inpatient and emergency care facility" },
  { value: "practice", label: "Practice", description: "Private medical practice" },
  { value: "pharmacy", label: "Pharmacy", description: "Dispensing pharmacy" },
  { value: "laboratory", label: "Laboratory", description: "Diagnostic testing facility" },
  { value: "imaging", label: "Imaging Center", description: "Radiology and imaging services" },
  { value: "therapy", label: "Therapy Center", description: "Physical, occupational, or speech therapy" },
  { value: "mental_health", label: "Mental Health", description: "Behavioral health and counseling" },
  { value: "dental", label: "Dental Practice", description: "Dental and oral health services" },
  { value: "veterinary", label: "Veterinary", description: "Animal healthcare services" },
];

const SETUP_STEPS = [
  { id: 1, title: "Organization Info", description: "Basic organization details" },
  { id: 2, title: "Location & Contact", description: "Geographic and contact information" },
  { id: 3, title: "Licensing", description: "Professional licensing information" },
  { id: 4, title: "Compliance", description: "Automatic compliance assignment" },
  { id: 5, title: "Review", description: "Review and confirm setup" },
];

export default function OrganizationSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [regions, setRegions] = useState<GeographicRegion[]>([]);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [assignedFrameworks, setAssignedFrameworks] = useState<ComplianceFramework[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [setup, setSetup] = useState<OrganizationSetup>({
    name: "",
    organization_type: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
    timezone: "America/New_York",
    license_number: "",
    license_authority: "",
    license_valid_until: "",
    auto_assign_compliance: true,
  });

  useEffect(() => {
    fetchRegions();
    fetchFrameworks();
  }, []);

  useEffect(() => {
    if (setup.postal_code && setup.auto_assign_compliance && currentStep === 4) {
      checkComplianceAssignment();
    }
  }, [setup.postal_code, setup.organization_type, currentStep]);

  const fetchRegions = async () => {
    try {
      const response = await fetch("/api/v1/geographic/regions");
      if (response.ok) {
        const data = await response.json();
        setRegions(data);
      }
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    }
  };

  const fetchFrameworks = async () => {
    try {
      const response = await fetch("/api/v1/compliance/frameworks");
      if (response.ok) {
        const data = await response.json();
        setFrameworks(data);
      }
    } catch (error) {
      console.error("Failed to fetch frameworks:", error);
    }
  };

  const checkComplianceAssignment = async () => {
    try {
      const response = await fetch("/api/v1/compliance/assignment/auto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity_type: "organization",
          entity_id: "preview",
          postal_code: setup.postal_code,
          organization_type: setup.organization_type,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAssignedFrameworks(result.assigned_frameworks || []);
      }
    } catch (error) {
      console.error("Failed to check compliance assignment:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < SETUP_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(setup),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Organization created successfully!");
        // TODO: Redirect to organization dashboard
      }
    } catch (error) {
      console.error("Failed to create organization:", error);
      alert("Failed to create organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetup = (field: string, value: any) => {
    setSetup(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return setup.name && setup.organization_type;
      case 2:
        return setup.email && setup.address && setup.city && setup.postal_code;
      case 3:
        return true; // Optional licensing info
      case 4:
        return true; // Compliance is auto-assigned
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Westside Medical Clinic"
                value={setup.name}
                onChange={(e) => updateSetup("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Organization Type *</Label>
              <Select value={setup.organization_type} onValueChange={(value) => updateSetup("organization_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your organization type" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATION_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of your organization"
                value={setup.description}
                onChange={(e) => updateSetup("description", e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@organization.com"
                  value={setup.email}
                  onChange={(e) => updateSetup("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={setup.phone}
                  onChange={(e) => updateSetup("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://www.organization.com"
                value={setup.website}
                onChange={(e) => updateSetup("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={setup.address}
                onChange={(e) => updateSetup("address", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={setup.city}
                  onChange={(e) => updateSetup("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={setup.state}
                  onChange={(e) => updateSetup("state", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Postal Code *</Label>
                <Input
                  id="postal"
                  placeholder="12345"
                  value={setup.postal_code}
                  onChange={(e) => updateSetup("postal_code", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={setup.country} onValueChange={(value) => updateSetup("country", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={setup.timezone} onValueChange={(value) => updateSetup("timezone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London Time</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="license-number">Professional License Number</Label>
              <Input
                id="license-number"
                placeholder="e.g., MD12345, NPI1234567890"
                value={setup.license_number}
                onChange={(e) => updateSetup("license_number", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license-authority">Licensing Authority</Label>
              <Input
                id="license-authority"
                placeholder="e.g., State Medical Board, DEA"
                value={setup.license_authority}
                onChange={(e) => updateSetup("license_authority", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license-expiry">License Valid Until</Label>
              <Input
                id="license-expiry"
                type="date"
                value={setup.license_valid_until}
                onChange={(e) => updateSetup("license_valid_until", e.target.value)}
              />
            </div>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Professional Licensing</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Licensing information helps us ensure compliance with professional standards and regulatory requirements.
                      This information is optional but recommended for healthcare organizations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-assign"
                checked={setup.auto_assign_compliance}
                onCheckedChange={(checked) => updateSetup("auto_assign_compliance", checked)}
              />
              <Label htmlFor="auto-assign">Automatically assign compliance frameworks based on location</Label>
            </div>

            {setup.auto_assign_compliance && assignedFrameworks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Automatically Assigned Compliance Frameworks</CardTitle>
                  <CardDescription>
                    Based on your organization type ({ORGANIZATION_TYPES.find(t => t.value === setup.organization_type)?.label}) 
                    and location ({setup.postal_code}), the following compliance frameworks will be assigned:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignedFrameworks.map(framework => (
                      <div key={framework.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{framework.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {framework.code} v{framework.version} • {framework.jurisdiction}
                          </div>
                          {framework.description && (
                            <div className="text-xs text-muted-foreground mt-1">{framework.description}</div>
                          )}
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Auto-assigned
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {setup.auto_assign_compliance && assignedFrameworks.length === 0 && setup.postal_code && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mt-0.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-900">No Auto-Assignment Available</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        No compliance frameworks were automatically assigned for postal code {setup.postal_code}.
                        You can manually assign frameworks after organization setup.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Compliance Framework Auto-Assignment</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Auto-assignment analyzes your organization's location and type to suggest relevant compliance frameworks
                      like HIPAA (US healthcare), GDPR (EU data protection), or SOX (US financial reporting).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Summary</CardTitle>
                <CardDescription>Review your organization setup before creating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Organization Name</div>
                    <div className="text-sm text-muted-foreground">{setup.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm text-muted-foreground">
                      {ORGANIZATION_TYPES.find(t => t.value === setup.organization_type)?.label}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{setup.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{setup.phone || "Not provided"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">
                      {setup.address}, {setup.city}, {setup.state} {setup.postal_code}, {setup.country}
                    </div>
                  </div>
                  {setup.license_number && (
                    <div className="col-span-2">
                      <div className="text-sm font-medium">Professional License</div>
                      <div className="text-sm text-muted-foreground">
                        {setup.license_number} ({setup.license_authority})
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {assignedFrameworks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Compliance Frameworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {assignedFrameworks.map(framework => (
                      <div key={framework.id} className="text-sm">
                        {framework.name} ({framework.code} v{framework.version})
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Organization Setup</h1>
          <p className="text-muted-foreground">
            Set up your healthcare organization with compliance and geographic settings
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {SETUP_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm ${
                  currentStep === step.id 
                    ? "border-blue-500 bg-blue-500 text-white"
                    : currentStep > step.id
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 text-gray-500"
                }`}>
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                {index < SETUP_STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 ml-2 ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold">{SETUP_STEPS[currentStep - 1].title}</h2>
          <p className="text-muted-foreground">{SETUP_STEPS[currentStep - 1].description}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < SETUP_STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Organization"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}