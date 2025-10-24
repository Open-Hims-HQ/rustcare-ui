import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

export const meta: MetaFunction = () => {
  return [
    { title: "Geographic Locations - RustCare Admin" },
    { name: "description", content: "Manage geographic locations and compliance mapping" },
  ];
};

interface GeographicRegion {
  id: string;
  name: string;
  code: string;
  region_type: string;
  parent_region_id?: string;
  path: string;
  postal_codes: string[];
  compliance_frameworks: string[];
  is_active: boolean;
}

interface ComplianceFramework {
  id: string;
  name: string;
  code: string;
  version: string;
  jurisdiction: string;
}

interface PostalCompliance {
  postal_code: string;
  region_id: string;
  region_name: string;
  compliance_frameworks: ComplianceFramework[];
}

export default function AdminGeographic() {
  const [regions, setRegions] = useState<GeographicRegion[]>([]);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [postalLookup, setPostalLookup] = useState<PostalCompliance | null>(null);
  const [selectedRegionType, setSelectedRegionType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isAddRegionOpen, setIsAddRegionOpen] = useState(false);
  const [isPostalLookupOpen, setIsPostalLookupOpen] = useState(false);

  // Form state for new region
  const [newRegion, setNewRegion] = useState({
    name: "",
    code: "",
    region_type: "country",
    parent_region_id: "",
    postal_codes: "",
    compliance_frameworks: [] as string[],
  });

  useEffect(() => {
    fetchRegions();
    fetchFrameworks();
  }, []);

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

  const handleAddRegion = async () => {
    try {
      const regionData = {
        ...newRegion,
        postal_codes: newRegion.postal_codes ? newRegion.postal_codes.split(",").map(code => code.trim()) : [],
      };
      
      const response = await fetch("/api/v1/geographic/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regionData),
      });

      if (response.ok) {
        setIsAddRegionOpen(false);
        setNewRegion({
          name: "",
          code: "",
          region_type: "country",
          parent_region_id: "",
          postal_codes: "",
          compliance_frameworks: [],
        });
        fetchRegions();
      }
    } catch (error) {
      console.error("Failed to create region:", error);
    }
  };

  const handlePostalLookup = async () => {
    if (!postalCode.trim()) return;

    try {
      const response = await fetch(`/api/v1/geographic/postal/${postalCode}/compliance`);
      if (response.ok) {
        const data = await response.json();
        setPostalLookup(data);
      }
    } catch (error) {
      console.error("Failed to lookup postal code:", error);
      setPostalLookup(null);
    }
  };

  const filteredRegions = regions.filter(region => {
    const matchesType = selectedRegionType === "all" || region.region_type === selectedRegionType;
    const matchesSearch = searchTerm === "" || 
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const buildRegionHierarchy = (regions: GeographicRegion[]) => {
    const regionMap = new Map(regions.map(r => [r.id, r]));
    const hierarchy: Array<GeographicRegion & { children: GeographicRegion[] }> = [];

    regions.forEach(region => {
      const regionWithChildren = { ...region, children: [] as GeographicRegion[] };
      
      if (!region.parent_region_id) {
        hierarchy.push(regionWithChildren);
      } else {
        const parent = regionMap.get(region.parent_region_id);
        if (parent) {
          // Find parent in hierarchy and add as child
          const findAndAddChild = (nodes: any[]): boolean => {
            for (const node of nodes) {
              if (node.id === region.parent_region_id) {
                node.children.push(regionWithChildren);
                return true;
              }
              if (findAndAddChild(node.children)) {
                return true;
              }
            }
            return false;
          };
          findAndAddChild(hierarchy);
        }
      }
    });

    return hierarchy;
  };

  const hierarchy = buildRegionHierarchy(filteredRegions);

  const RegionTreeNode = ({ region, level = 0 }: { region: any, level?: number }) => (
    <div className={`pl-${level * 4} mb-2`}>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">{region.name}</CardTitle>
              <CardDescription className="text-xs">
                {region.code} • {region.region_type} • {region.postal_codes?.length || 0} postal codes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </div>
        </CardHeader>
        {region.compliance_frameworks && region.compliance_frameworks.length > 0 && (
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              Compliance: {region.compliance_frameworks.join(", ")}
            </div>
          </CardContent>
        )}
      </Card>
      {region.children?.map((child: any) => (
        <RegionTreeNode key={child.id} region={child} level={level + 1} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geographic Locations</h1>
          <p className="text-muted-foreground">
            Manage geographic regions and compliance framework assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPostalLookupOpen} onOpenChange={setIsPostalLookupOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Postal Code Lookup</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Postal Code Compliance Lookup</DialogTitle>
                <DialogDescription>
                  Check which compliance frameworks are automatically assigned to a postal code
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter postal code (e.g., 10001, M5V 3L9)"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                  <Button onClick={handlePostalLookup}>Lookup</Button>
                </div>
                {postalLookup && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lookup Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Postal Code:</strong> {postalLookup.postal_code}</p>
                        <p><strong>Region:</strong> {postalLookup.region_name}</p>
                        <div>
                          <strong>Compliance Frameworks:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {postalLookup.compliance_frameworks.map(framework => (
                              <li key={framework.id}>
                                {framework.name} ({framework.code} v{framework.version})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddRegionOpen} onOpenChange={setIsAddRegionOpen}>
            <DialogTrigger asChild>
              <Button>Add Region</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Geographic Region</DialogTitle>
                <DialogDescription>
                  Create a new geographic region with compliance framework assignments
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Region Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., United States, California, Los Angeles"
                      value={newRegion.name}
                      onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                      showInfoIcon
                      aria-label="Enter geographic region name"
                    />
                    <p id="name-help" className="text-xs text-neutral-500">
                      Full name of the geographic region
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">
                      Region Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="code"
                      placeholder="e.g., US, CA, LA"
                      value={newRegion.code}
                      onChange={(e) => setNewRegion({ ...newRegion, code: e.target.value })}
                      showInfoIcon
                      aria-label="Enter region code abbreviation"
                    />
                    <p id="code-help" className="text-xs text-neutral-500">
                      Short code or abbreviation (e.g., US, CA)
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Region Type</Label>
                    <Select
                      value={newRegion.region_type}
                      onValueChange={(value) => setNewRegion({ ...newRegion, region_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="country">Country</SelectItem>
                        <SelectItem value="state">State/Province</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="district">District</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent">Parent Region</Label>
                    <Select
                      value={newRegion.parent_region_id}
                      onValueChange={(value) => setNewRegion({ ...newRegion, parent_region_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent region (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region.id} value={region.id}>
                            {region.name} ({region.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Codes</Label>
                  <Input
                    id="postal"
                    placeholder="Comma-separated postal codes (e.g., 10001, 10002, 10003)"
                    value={newRegion.postal_codes}
                    onChange={(e) => setNewRegion({ ...newRegion, postal_codes: e.target.value })}
                    showInfoIcon
                    aria-label="Enter postal codes for this region"
                    aria-describedby="postal-help"
                  />
                  <p id="postal-help" className="text-xs text-neutral-500">
                    Comma-separated list of postal/ZIP codes for this region
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddRegionOpen(false)}
                    aria-label="Cancel creating region"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddRegion}
                    aria-label="Create new geographic region"
                  >
                    Create Region
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search Regions</Label>
          <Input
            id="search"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type-filter">Filter by Type</Label>
          <Select value={selectedRegionType} onValueChange={setSelectedRegionType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="country">Countries</SelectItem>
              <SelectItem value="state">States/Provinces</SelectItem>
              <SelectItem value="city">Cities</SelectItem>
              <SelectItem value="district">Districts</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Regional Hierarchy</h2>
        {hierarchy.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No regions found. Add your first geographic region to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {hierarchy.map(region => (
              <RegionTreeNode key={region.id} region={region} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}