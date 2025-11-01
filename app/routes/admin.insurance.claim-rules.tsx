import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { AlertCircle, Plus, Save, Trash2, Shield } from "lucide-react";

export const meta = () => {
  return [
    { title: "Insurance Claim Rules | RustCare Admin" },
    { name: "description", content: "Configure insurance claim submission rules" },
  ];
};

export const loader = async () => {
  const rules = [
    {
      id: "1",
      providerId: "BCBS",
      providerName: "BlueCross BlueShield",
      name: "BCBS Claim Requirements",
      isActive: true,
      rules: {
        timelyFilingDays: 90,
        requirePriorAuth: true,
        requireReferral: false,
        requireSecondaryInsurance: false,
        autoSubmit: true,
        rejectOnErrors: true,
        maxSubmissionAttempts: 3,
      },
      requirements: [
        "Valid diagnosis codes required",
        "Modifier codes for multiple procedures",
        "Provider NPI must match enrollment",
      ],
      exceptionCodes: ["G0425", "G0426", "G0427"],
    },
    {
      id: "2",
      providerId: "MC",
      providerName: "Medicare",
      name: "Medicare Fee Schedule",
      isActive: true,
      rules: {
        timelyFilingDays: 365,
        requirePriorAuth: false,
        requireReferral: false,
        requireSecondaryInsurance: true,
        autoSubmit: true,
        rejectOnErrors: false,
        maxSubmissionAttempts: 5,
      },
      requirements: [
        "Valid ICD-10 diagnosis required",
        "PQRS quality reporting",
        "MU EHR attestation",
      ],
      exceptionCodes: ["G0438", "G0439"],
    },
    {
      id: "3",
      providerId: "AET",
      providerName: "Aetna",
      name: "Aetna Standard Rules",
      isActive: true,
      rules: {
        timelyFilingDays: 90,
        requirePriorAuth: true,
        requireReferral: true,
        requireSecondaryInsurance: false,
        autoSubmit: true,
        rejectOnErrors: true,
        maxSubmissionAttempts: 3,
      },
      requirements: [
        "Primary care physician referral required",
        "In-network provider verification",
        "Bundling edits applied",
      ],
      exceptionCodes: [],
    },
  ];

  const providers = [
    { id: "BCBS", name: "BlueCross BlueShield" },
    { id: "AET", name: "Aetna" },
    { id: "MC", name: "Medicare" },
    { id: "TXMD", name: "Medicaid Texas" },
  ];

  return { rules, providers };
};

export default function InsuranceClaimRules() {
  const { rules, providers } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6 space-y-6" id="insurance-claim-rules-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" id="insurance-claim-rules-title">Claim Rules</h1>
          <p className="text-muted-foreground mt-1">
            Configure claim submission rules and requirements for each insurance provider
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule Set
        </Button>
      </div>

      {rules.map((rule) => (
        <Card key={rule.id} id={`claim-rule-${rule.id}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{rule.name}</CardTitle>
                <CardDescription>
                  {rule.providerName} ({rule.providerId})
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`active-${rule.id}`}>Active</Label>
                  <Switch id={`active-${rule.id}`} defaultChecked={rule.isActive} />
                </div>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Basic Rules */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Submission Rules</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Timely Filing Days</Label>
                      <Input
                        type="number"
                        defaultValue={rule.rules.timelyFilingDays}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Max Submission Attempts</Label>
                      <Input
                        type="number"
                        defaultValue={rule.rules.maxSubmissionAttempts}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Prior Authorization</Label>
                      <Switch defaultChecked={rule.rules.requirePriorAuth} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Referral</Label>
                      <Switch defaultChecked={rule.rules.requireReferral} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require Secondary Insurance</Label>
                      <Switch defaultChecked={rule.rules.requireSecondaryInsurance} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto Submit Claims</Label>
                      <Switch defaultChecked={rule.rules.autoSubmit} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Reject on Errors</Label>
                      <Switch defaultChecked={rule.rules.rejectOnErrors} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Requirements */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Claim Requirements</h3>
                  <Textarea
                    defaultValue={rule.requirements.join("\n")}
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Exception Codes</h3>
                  <Input
                    defaultValue={rule.exceptionCodes.join(", ")}
                    placeholder="G0425, G0426, G0427"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CPT codes excluded from standard rules
                  </p>
                </div>
              </div>
            </div>

            {/* Alert */}
            {rule.rules.requirePriorAuth && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">
                    Prior Authorization Required
                  </p>
                  <p className="text-amber-700 mt-1">
                    All services require prior authorization for this provider.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

