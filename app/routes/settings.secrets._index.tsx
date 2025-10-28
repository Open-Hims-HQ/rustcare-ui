import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import {
  Key,
  Plus,
  Search,
  Filter,
  RotateCw,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { useTranslation } from "~/hooks/useTranslation";
import { PermissionButton } from "~/components/PermissionGuard";

// Mock data - replace with actual API calls
interface Secret {
  id: string;
  name: string;
  description: string;
  provider: string;
  status: "active" | "expired" | "rotating";
  lastRotated: string;
  expiresAt?: string;
  tags: string[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "Secrets Management - RustCare" },
    { name: "description", content: "Manage and secure your application secrets" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data for demonstration - will be replaced with actual API integration
  const mockSecrets: Secret[] = [
    {
      id: "1",
      name: "database-password",
      description: "Production database credentials",
      provider: "vault",
      status: "active",
      lastRotated: "2024-01-15T10:30:00Z",
      expiresAt: "2024-07-15T10:30:00Z",
      tags: ["production", "database"],
    },
    {
      id: "2",
      name: "api-key-stripe",
      description: "Stripe payment API key",
      provider: "aws",
      status: "active",
      lastRotated: "2024-01-10T14:20:00Z",
      tags: ["production", "payment", "api"],
    },
    {
      id: "3",
      name: "oauth-client-secret",
      description: "OAuth 2.0 client secret",
      provider: "vault",
      status: "rotating",
      lastRotated: "2024-01-20T09:15:00Z",
      expiresAt: "2024-06-20T09:15:00Z",
      tags: ["auth", "oauth"],
    },
  ];

  return json({ secrets: mockSecrets });
}

export default function SecretsIndex() {
  const { secrets } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [providerFilter, setProviderFilter] = useState(searchParams.get("provider") || "all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());

  const filteredSecrets = secrets.filter((secret) => {
    const matchesSearch = secret.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      secret.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = providerFilter === "all" || secret.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const stats = {
    total: secrets.length,
    active: secrets.filter(s => s.status === "active").length,
    expired: secrets.filter(s => s.status === "expired").length,
    rotating: secrets.filter(s => s.status === "rotating").length,
  };

  const getStatusIcon = (status: Secret["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "rotating":
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadgeVariant = (status: Secret["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "rotating":
        return "secondary";
    }
  };

  const toggleSecretVisibility = (secretId: string) => {
    setRevealedSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(secretId)) {
        newSet.delete(secretId);
      } else {
        newSet.add(secretId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Key className="h-8 w-8" />
            {t("settings.secrets.title")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("settings.secrets.subtitle")}</p>
        </div>
        <PermissionButton
          permission="secrets:create"
          asChild
        >
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("settings.secrets.create")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("settings.secrets.create")}</DialogTitle>
                <DialogDescription>{t("settings.secrets.description")}</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("settings.secrets.form.name")}</Label>
                    <Input
                      id="name"
                      placeholder={t("settings.secrets.form.namePlaceholder")}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="value">{t("settings.secrets.form.value")}</Label>
                    <textarea
                      id="value"
                      name="value"
                      placeholder={t("settings.secrets.form.valuePlaceholder")}
                      required
                      rows={4}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">{t("settings.secrets.form.description")}</Label>
                    <Input
                      id="description"
                      placeholder={t("settings.secrets.form.descriptionPlaceholder")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider">{t("settings.secrets.form.provider")}</Label>
                    <Select>
                      <SelectTrigger id="provider">
                        <SelectValue placeholder={t("settings.secrets.form.selectProvider")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vault">{t("settings.secrets.providerConfig.vault.name")}</SelectItem>
                        <SelectItem value="aws">{t("settings.secrets.providerConfig.aws.name")}</SelectItem>
                        <SelectItem value="azure">{t("settings.secrets.providerConfig.azure.name")}</SelectItem>
                        <SelectItem value="gcp">{t("settings.secrets.providerConfig.gcp.name")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tags">{t("settings.secrets.form.tags")}</Label>
                    <Input
                      id="tags"
                      placeholder={t("settings.secrets.form.tagsPlaceholder")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit">{t("common.create")}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </PermissionButton>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("settings.secrets.stats.total")}</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("settings.secrets.stats.active")}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("settings.secrets.stats.expired")}</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("settings.secrets.stats.rotating")}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rotating}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("common.filter")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("settings.secrets.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("settings.secrets.allProviders")}</SelectItem>
                  <SelectItem value="vault">{t("settings.secrets.providerConfig.vault.name")}</SelectItem>
                  <SelectItem value="aws">{t("settings.secrets.providerConfig.aws.name")}</SelectItem>
                  <SelectItem value="azure">{t("settings.secrets.providerConfig.azure.name")}</SelectItem>
                  <SelectItem value="gcp">{t("settings.secrets.providerConfig.gcp.name")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secrets List */}
      {filteredSecrets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("settings.secrets.noSecrets")}</h3>
            <p className="text-muted-foreground mb-4">{t("settings.secrets.noSecretsDescription")}</p>
            <PermissionButton permission="secrets:create" asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("settings.secrets.create")}
              </Button>
            </PermissionButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSecrets.map((secret) => (
            <Card key={secret.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {secret.name}
                      {getStatusIcon(secret.status)}
                    </CardTitle>
                    <CardDescription>{secret.description}</CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(secret.status)}>
                    {t(`settings.secrets.status.${secret.status}`)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {t(`settings.secrets.providerConfig.${secret.provider}.name`)}
                    </Badge>
                    {secret.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                    <span>{t("settings.secrets.auditLog.timestamp")}: {new Date(secret.lastRotated).toLocaleDateString()}</span>
                    {secret.expiresAt && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {t("common.expiresAt")}: {new Date(secret.expiresAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <PermissionButton permission="secrets:read" variant="outline" size="sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecretVisibility(secret.id)}
                      >
                        {revealedSecrets.has(secret.id) ? (
                          <>
                            <EyeOff className="mr-2 h-3 w-3" />
                            {t("settings.secrets.actions.hideValue")}
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-3 w-3" />
                            {t("settings.secrets.actions.revealValue")}
                          </>
                        )}
                      </Button>
                    </PermissionButton>
                    <PermissionButton permission="secrets:read" variant="outline" size="sm">
                      <Button variant="outline" size="sm">
                        <Copy className="mr-2 h-3 w-3" />
                        {t("settings.secrets.actions.copyValue")}
                      </Button>
                    </PermissionButton>
                    <PermissionButton permission="secrets:update" variant="outline" size="sm">
                      <Button variant="outline" size="sm">
                        <RotateCw className="mr-2 h-3 w-3" />
                        {t("settings.secrets.actions.rotateNow")}
                      </Button>
                    </PermissionButton>
                    <PermissionButton permission="secrets:delete" variant="destructive" size="sm">
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-3 w-3" />
                        {t("common.delete")}
                      </Button>
                    </PermissionButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
