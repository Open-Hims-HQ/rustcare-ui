import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const meta: MetaFunction = () => {
  return [
    { title: "Compliance Management - RustCare Admin" },
    { name: "description", content: "Manage compliance frameworks and rules" },
  ];
};

interface ComplianceFramework {
  id: string;
  name: string;
  code: string;
  version: string;
  description?: string;
  jurisdiction: string;
  effective_date: string;
  expiry_date?: string;
  authority: string;
  website?: string;
  auto_assignment_rules: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ComplianceRule {
  id: string;
  framework_id: string;
  rule_code: string;
  title: string;
  description?: string;
  rule_type: string;
  category: string;
  severity: string;
  validation_logic: Record<string, any>;
  remediation_guidance?: string;
  is_mandatory: boolean;
  is_active: boolean;
}

interface AutoAssignmentRequest {
  entity_type: string;
  entity_id: string;
  geographic_region?: string;
  postal_code?: string;
  organization_type?: string;
}

export default function AdminCompliance() {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFrameworkOpen, setIsAddFrameworkOpen] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [isAutoAssignOpen, setIsAutoAssignOpen] = useState(false);

  // Form states
  const [newFramework, setNewFramework] = useState({
    name: "",
    code: "",
    version: "1.0",
    description: "",
    jurisdiction: "",
    authority: "",
    website: "",
    effective_date: "",
    expiry_date: "",
  });

  const [newRule, setNewRule] = useState({
    framework_id: "",
    rule_code: "",
    title: "",
    description: "",
    rule_type: "data_protection",
    category: "privacy",
    severity: "medium",
    is_mandatory: true,
    remediation_guidance: "",
  });

  const [autoAssignRequest, setAutoAssignRequest] = useState({
    entity_type: "organization",
    entity_id: "",
    postal_code: "",
    organization_type: "clinic",
  });

  useEffect(() => {
    fetchFrameworks();
    fetchRules();
  }, []);

  useEffect(() => {
    if (selectedFramework) {
      fetchFrameworkRules(selectedFramework);
    }
  }, [selectedFramework]);

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

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/v1/compliance/rules");
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error("Failed to fetch rules:", error);
    }
  };

  const fetchFrameworkRules = async (frameworkId: string) => {
    try {
      const response = await fetch(`/api/v1/compliance/frameworks/${frameworkId}/rules`);
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error("Failed to fetch framework rules:", error);
    }
  };

  const handleAddFramework = async () => {
    try {
      const response = await fetch("/api/v1/compliance/frameworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newFramework,
          auto_assignment_rules: {
            jurisdiction: newFramework.jurisdiction,
            auto_assign: true,
          },
        }),
      });

      if (response.ok) {
        setIsAddFrameworkOpen(false);
        setNewFramework({
          name: "",
          code: "",
          version: "1.0",
          description: "",
          jurisdiction: "",
          authority: "",
          website: "",
          effective_date: "",
          expiry_date: "",
        });
        fetchFrameworks();
      }
    } catch (error) {
      console.error("Failed to create framework:", error);
    }
  };

  const handleAddRule = async () => {
    try {
      const response = await fetch("/api/v1/compliance/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRule,
          validation_logic: {
            type: newRule.rule_type,
            category: newRule.category,
            severity: newRule.severity,
          },
        }),
      });

      if (response.ok) {
        setIsAddRuleOpen(false);
        setNewRule({
          framework_id: "",
          rule_code: "",
          title: "",
          description: "",
          rule_type: "data_protection",
          category: "privacy",
          severity: "medium",
          is_mandatory: true,
          remediation_guidance: "",
        });
        if (selectedFramework) {
          fetchFrameworkRules(selectedFramework);
        } else {
          fetchRules();
        }
      }
    } catch (error) {
      console.error("Failed to create rule:", error);
    }
  };

  const handleAutoAssign = async () => {
    try {
      const response = await fetch("/api/v1/compliance/assignment/auto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(autoAssignRequest),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Auto-assigned ${result.assigned_frameworks?.length || 0} compliance frameworks`);
        setIsAutoAssignOpen(false);
      }
    } catch (error) {
      console.error("Failed to auto-assign compliance:", error);
    }
  };

  const filteredFrameworks = frameworks.filter(framework =>
    searchTerm === "" ||
    framework.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    framework.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    framework.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRules = selectedFramework 
    ? rules.filter(rule => rule.framework_id === selectedFramework)
    : rules;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-700 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-700 bg-green-50 border-green-200";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Compliance Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage compliance frameworks, rules, and auto-assignment policies
            </p>
          </div>
        <div className="flex gap-2">
          <Dialog open={isAutoAssignOpen} onOpenChange={setIsAutoAssignOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Auto-Assign Test</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Auto-Assignment</DialogTitle>
                <DialogDescription>
                  Test automatic compliance framework assignment based on location and organization type
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entity-type">Entity Type</Label>
                    <Select
                      value={autoAssignRequest.entity_type}
                      onValueChange={(value) => setAutoAssignRequest({ ...autoAssignRequest, entity_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-type">Organization Type</Label>
                    <Select
                      value={autoAssignRequest.organization_type}
                      onValueChange={(value) => setAutoAssignRequest({ ...autoAssignRequest, organization_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="practice">Practice</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="laboratory">Laboratory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    placeholder="e.g., 10001, M5V 3L9"
                    value={autoAssignRequest.postal_code}
                    onChange={(e) => setAutoAssignRequest({ ...autoAssignRequest, postal_code: e.target.value })}
                    showInfoIcon
                    aria-label="Enter postal code for geographic compliance rules"
                  />
                  <p id="postal-help" className="text-xs text-neutral-500">
                    Enter postal/ZIP code to determine applicable regional compliance rules
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAutoAssignOpen(false)}
                    aria-label="Cancel auto-assign test"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAutoAssign}
                    aria-label="Test automatic compliance framework assignment"
                  >
                    Test Assignment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Rule</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Compliance Rule</DialogTitle>
                <DialogDescription>
                  Create a new compliance rule for a framework
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="framework">Framework</Label>
                    <Select
                      value={newRule.framework_id}
                      onValueChange={(value) => setNewRule({ ...newRule, framework_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworks.map(framework => (
                          <SelectItem key={framework.id} value={framework.id}>
                            {framework.name} ({framework.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rule-code">
                      Rule Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="rule-code"
                      placeholder="e.g., HIPAA-164.306"
                      value={newRule.rule_code}
                      onChange={(e) => setNewRule({ ...newRule, rule_code: e.target.value })}
                      showInfoIcon
                      aria-label="Enter unique rule code identifier"
                    />
                    <p id="rule-code-help" className="text-xs text-neutral-500">
                      Unique code from the compliance framework (e.g., HIPAA-164.306)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Rule Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Administrative Safeguards"
                    value={newRule.title}
                    onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                    showInfoIcon
                    aria-label="Enter descriptive rule title"
                  />
                  <p id="title-help" className="text-xs text-neutral-500">
                    Clear, descriptive title for this compliance rule
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Detailed description of the rule"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    showInfoIcon
                    aria-label="Enter detailed rule description"
                  />
                  <p id="description-help" className="text-xs text-neutral-500">
                    Comprehensive description of what this rule requires
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rule-type">Rule Type</Label>
                    <Select
                      value={newRule.rule_type}
                      onValueChange={(value) => setNewRule({ ...newRule, rule_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="data_protection">Data Protection</SelectItem>
                        <SelectItem value="access_control">Access Control</SelectItem>
                        <SelectItem value="audit_trail">Audit Trail</SelectItem>
                        <SelectItem value="encryption">Encryption</SelectItem>
                        <SelectItem value="backup">Backup & Recovery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newRule.category}
                      onValueChange={(value) => setNewRule({ ...newRule, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="privacy">Privacy</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select
                      value={newRule.severity}
                      onValueChange={(value) => setNewRule({ ...newRule, severity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mandatory"
                    checked={newRule.is_mandatory}
                    onCheckedChange={(checked) => setNewRule({ ...newRule, is_mandatory: checked as boolean })}
                  />
                  <Label htmlFor="mandatory">Mandatory Rule</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddRuleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRule}>Create Rule</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddFrameworkOpen} onOpenChange={setIsAddFrameworkOpen}>
            <DialogTrigger asChild>
              <Button>Add Framework</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Compliance Framework</DialogTitle>
                <DialogDescription>
                  Create a new compliance framework (e.g., HIPAA, GDPR, SOX)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Framework Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., HIPAA Privacy Rule"
                      value={newFramework.name}
                      onChange={(e) => setNewFramework({ ...newFramework, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Framework Code</Label>
                    <Input
                      id="code"
                      placeholder="e.g., HIPAA"
                      value={newFramework.code}
                      onChange={(e) => setNewFramework({ ...newFramework, code: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      placeholder="e.g., 1.0, 2024.1"
                      value={newFramework.version}
                      onChange={(e) => setNewFramework({ ...newFramework, version: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jurisdiction">Jurisdiction</Label>
                    <Input
                      id="jurisdiction"
                      placeholder="e.g., United States, European Union"
                      value={newFramework.jurisdiction}
                      onChange={(e) => setNewFramework({ ...newFramework, jurisdiction: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authority">Regulatory Authority</Label>
                  <Input
                    id="authority"
                    placeholder="e.g., HHS, ICO, SEC"
                    value={newFramework.authority}
                    onChange={(e) => setNewFramework({ ...newFramework, authority: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the framework"
                    value={newFramework.description}
                    onChange={(e) => setNewFramework({ ...newFramework, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="effective">Effective Date</Label>
                    <Input
                      id="effective"
                      type="date"
                      value={newFramework.effective_date}
                      onChange={(e) => setNewFramework({ ...newFramework, effective_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={newFramework.expiry_date}
                      onChange={(e) => setNewFramework({ ...newFramework, expiry_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddFrameworkOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFramework}>Create Framework</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-slate-700 font-medium">Search Frameworks</Label>
            <Input
              id="search"
              placeholder="Search by name, code, or jurisdiction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="framework-filter" className="text-slate-700 font-medium">Filter Rules by Framework</Label>
            <Select value={selectedFramework || "all"} onValueChange={(value) => setSelectedFramework(value === "all" ? null : value)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All frameworks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All frameworks</SelectItem>
                {frameworks.map(framework => (
                  <SelectItem key={framework.id} value={framework.id}>
                    {framework.name} ({framework.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Frameworks and Rules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Compliance Frameworks</h2>
            {filteredFrameworks.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-600">
                    No frameworks found. Add your first compliance framework to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredFrameworks.map(framework => (
                  <Card 
                    key={framework.id} 
                    className={`bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-all ${
                      selectedFramework === framework.id ? "ring-2 ring-blue-500 border-blue-300" : ""
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm font-semibold text-slate-900">{framework.name}</CardTitle>
                          <CardDescription className="text-xs text-slate-600">
                            {framework.code} v{framework.version} • {framework.jurisdiction} • {framework.authority}
                          </CardDescription>
                        </div>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedFramework === framework.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFramework(framework.id)}
                        >
                          View Rules
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" aria-label="Framework actions">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Framework Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Framework
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(framework.code)}>
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Export Framework
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Add Rule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Deprecate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      </div>
                    </CardHeader>
                    {framework.description && (
                      <CardContent className="pt-0">
                        <p className="text-xs text-slate-600">{framework.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Compliance Rules
              {selectedFramework && (
                <span className="text-sm font-normal text-slate-500 ml-2">
                  ({frameworks.find(f => f.id === selectedFramework)?.name})
                </span>
              )}
            </h2>
            {displayedRules.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-600">
                    No rules found. {selectedFramework ? "Add rules to this framework" : "Select a framework to view rules"}.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {displayedRules.map(rule => (
                  <Card key={rule.id} className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-semibold text-slate-900">{rule.title}</CardTitle>
                          <CardDescription className="text-xs text-slate-600">
                            {rule.rule_code} • {rule.category} • {rule.rule_type}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getSeverityColor(rule.severity)}`}>
                            {rule.severity}
                          </span>
                          {rule.is_mandatory && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                              Mandatory
                            </span>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Rule actions">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuLabel>Rule Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Disable Rule
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    {rule.description && (
                      <CardContent className="pt-0">
                        <p className="text-xs text-slate-600">{rule.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  );
}