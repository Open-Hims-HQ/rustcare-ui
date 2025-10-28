import { json, type LoaderFunctionArgs, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import {
  Server,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Settings,
  Beaker,
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
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useTranslation } from "~/hooks/useTranslation";

interface ProviderConfig {
  id: string;
  name: string;
  type: "vault" | "aws" | "azure" | "gcp" | "kubernetes" | "environment" | "kms";
  enabled: boolean;
  priority: number;
  config: Record<string, any>;
  health: {
    healthy: boolean;
    message: string;
    last_check: string;
  };
}

interface ProvidersData {
  providers: ProviderConfig[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "Secret Providers - RustCare" },
    { name: "description", content: "Configure and manage secret provider connections" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Replace with actual API call
  const data: ProvidersData = {
    providers: [
      {
        id: "vault-1",
        name: "Production Vault",
        type: "vault",
        enabled: true,
        priority: 1,
        config: {
          address: "https://vault.example.com",
          namespace: "production",
          mount_path: "secret",
        },
        health: {
          healthy: true,
          message: "Vault is healthy",
          last_check: "2025-10-28T10:00:00Z",
        },
      },
      {
        id: "aws-1",
        name: "AWS Secrets Manager",
        type: "aws",
        enabled: true,
        priority: 2,
        config: {
          region: "us-east-1",
        },
        health: {
          healthy: true,
          message: "AWS is healthy",
          last_check: "2025-10-28T10:00:00Z",
        },
      },
    ],
  };

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  // TODO: Implement actual API calls
  switch (action) {
    case "create":
      return json({ success: true, message: "Provider added successfully" });
    case "update":
      return json({ success: true, message: "Provider updated successfully" });
    case "delete":
      return json({ success: true, message: "Provider deleted successfully" });
    case "test":
      return json({ success: true, message: "Provider connection successful" });
    default:
      return json({ success: false, message: "Invalid action" }, { status: 400 });
  }
}

export default function ProvidersManagement() {
  const { providers } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderConfig | null>(null);

  const isLoading = navigation.state === "submitting";

  const getProviderColor = (type: string) => {
    const colors: Record<string, string> = {
      vault: "text-yellow-600",
      aws: "text-orange-600",
      azure: "text-blue-600",
      gcp: "text-red-600",
      kubernetes: "text-blue-500",
      environment: "text-slate-600",
      kms: "text-purple-600",
    };
    return colors[type] || "text-slate-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Server className="h-8 w-8" />
            {t("settings.secrets.providerConfig.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("settings.secrets.providerConfig.description")}
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button permission={{ resource: 'secret_provider', action: 'create' }}>
              <Plus className="mr-2 h-4 w-4" />
              {t("settings.secrets.providerConfig.addProvider")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <CreateProviderModal 
              onClose={() => setShowCreateModal(false)} 
              isLoading={isLoading} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Action Feedback */}
      {actionData && (
        <Alert variant={actionData.success ? "default" : "danger"}>
          <AlertDescription className="flex items-center gap-2">
            {actionData.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {actionData.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Providers Grid */}
      {providers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Server className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("settings.secrets.providerConfig.noProviders")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("settings.secrets.providerConfig.noProvidersDescription")}
            </p>
            <Button onClick={() => setShowCreateModal(true)} permission={{ resource: 'secret_provider', action: 'create' }}>
              <Plus className="mr-2 h-4 w-4" />
              {t("settings.secrets.providerConfig.addProvider")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={getProviderColor(provider.type)}>
                      <Server className="h-10 w-10" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle>{provider.name}</CardTitle>
                      <CardDescription>
                        {t(`settings.secrets.providerConfig.${provider.type}.name`)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={provider.enabled ? "default" : "secondary"}>
                    {provider.enabled ? t("common.enabled") : t("common.disabled")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Health Status */}
                  <div className="flex items-center gap-2">
                    {provider.health.healthy ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {provider.health.message}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {t("settings.secrets.providerConfig.priority")}:{" "}
                    </span>
                    <Badge variant="outline">{provider.priority}</Badge>
                  </div>

                  {/* Configuration Details */}
                  <div className="space-y-2">
                    {provider.type === "vault" && provider.config.address && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          {t("settings.secrets.providerConfig.vault.address")}:{" "}
                        </span>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {provider.config.address}
                        </code>
                      </div>
                    )}
                    {provider.type === "aws" && provider.config.region && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          {t("settings.secrets.providerConfig.aws.region")}:{" "}
                        </span>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {provider.config.region}
                        </code>
                      </div>
                    )}
                    {provider.type === "kms" && (
                      <div className="text-sm space-y-1">
                        {provider.config.kms_provider && (
                          <div>
                            <span className="text-muted-foreground">Provider: </span>
                            <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {provider.config.kms_provider}
                            </code>
                          </div>
                        )}
                        {provider.config.key_name && (
                          <div>
                            <span className="text-muted-foreground">Key: </span>
                            <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {provider.config.key_name}
                            </code>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Last Check */}
                  <div className="text-xs text-muted-foreground">
                    {t("settings.secrets.providerConfig.lastCheck")}:{" "}
                    {new Date(provider.health.last_check).toLocaleString()}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProvider(provider)}
                      permission={{ resource: 'secret_provider', action: 'update' }}
                    >
                      <Settings className="mr-2 h-3 w-3" />
                      {t("common.configure")}
                    </Button>
                    <Form method="post">
                      <input type="hidden" name="_action" value="test" />
                      <input type="hidden" name="id" value={provider.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        permission={{ resource: 'secret_provider', action: 'read' }}
                      >
                        <Beaker className="mr-2 h-3 w-3" />
                        {t("settings.secrets.providerConfig.testConnection")}
                      </Button>
                    </Form>
                    <Form method="post">
                      <input type="hidden" name="_action" value="delete" />
                      <input type="hidden" name="id" value={provider.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        disabled={isLoading}
                        permission={{ resource: 'secret_provider', action: 'delete' }}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        {t("common.delete")}
                      </Button>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Provider Dialog */}
      {selectedProvider && (
        <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <EditProviderModal
              provider={selectedProvider}
              onClose={() => setSelectedProvider(null)}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CreateProviderModal({
  onClose,
  isLoading,
}: {
  onClose: () => void;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const [providerType, setProviderType] = useState<string>("vault");

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("settings.secrets.providerConfig.addProvider")}</DialogTitle>
        <DialogDescription>
          {t("settings.secrets.providerConfig.addProviderDescription")}
        </DialogDescription>
      </DialogHeader>

      <Form method="post">
        <input type="hidden" name="_action" value="create" />

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              {t("settings.secrets.form.name")} *
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder={t("settings.secrets.providerConfig.namePlaceholder")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">
              {t("settings.secrets.form.provider")} *
            </Label>
            <Select name="type" value={providerType} onValueChange={setProviderType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vault">
                  {t("settings.secrets.providerConfig.vault.name")}
                </SelectItem>
                <SelectItem value="aws">
                  {t("settings.secrets.providerConfig.aws.name")}
                </SelectItem>
                <SelectItem value="azure">
                  {t("settings.secrets.providerConfig.azure.name")}
                </SelectItem>
                <SelectItem value="gcp">
                  {t("settings.secrets.providerConfig.gcp.name")}
                </SelectItem>
                <SelectItem value="kubernetes">
                  {t("settings.secrets.providerConfig.kubernetes.name")}
                </SelectItem>
                <SelectItem value="kms">
                  {t("settings.secrets.providerConfig.kms.name")}
                </SelectItem>
                <SelectItem value="environment">
                  {t("settings.secrets.providerConfig.environment.name")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">
              {t("settings.secrets.providerConfig.priority")}
            </Label>
            <Input
              id="priority"
              name="priority"
              type="number"
              min="1"
              defaultValue="1"
            />
            <p className="text-xs text-muted-foreground">
              {t("settings.secrets.providerConfig.priorityHint")}
            </p>
          </div>

          {/* Provider-specific configuration */}
          {providerType === "vault" && <VaultConfig />}
          {providerType === "aws" && <AwsConfig />}
          {providerType === "azure" && <AzureConfig />}
          {providerType === "gcp" && <GcpConfig />}
          {providerType === "kubernetes" && <KubernetesConfig />}
          {providerType === "kms" && <KmsConfig />}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {t("settings.secrets.providerConfig.addProvider")}
          </Button>
        </DialogFooter>
      </Form>
    </>
  );
}

function VaultConfig() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.secrets.providerConfig.vault.configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="vault_address">
            {t("settings.secrets.providerConfig.vault.address")} *
          </Label>
          <Input
            id="vault_address"
            name="vault_address"
            type="text"
            required
            placeholder="https://vault.example.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="vault_token">
            {t("settings.secrets.providerConfig.vault.token")} *
          </Label>
          <Input
            id="vault_token"
            name="vault_token"
            type="password"
            required
            placeholder="s.xxxxxxxxxxxxx"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="vault_namespace">
            {t("settings.secrets.providerConfig.vault.namespace")}
          </Label>
          <Input
            id="vault_namespace"
            name="vault_namespace"
            type="text"
            placeholder="production"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="vault_mount_path">
            {t("settings.secrets.providerConfig.vault.mountPath")}
          </Label>
          <Input
            id="vault_mount_path"
            name="vault_mount_path"
            type="text"
            defaultValue="secret"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AwsConfig() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.secrets.providerConfig.aws.configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="aws_region">
            {t("settings.secrets.providerConfig.aws.region")} *
          </Label>
          <Input
            id="aws_region"
            name="aws_region"
            type="text"
            required
            placeholder="us-east-1"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="aws_access_key_id">
            {t("settings.secrets.providerConfig.aws.accessKeyId")}
          </Label>
          <Input
            id="aws_access_key_id"
            name="aws_access_key_id"
            type="text"
            placeholder={t("settings.secrets.providerConfig.aws.useIamRole")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="aws_secret_access_key">
            {t("settings.secrets.providerConfig.aws.secretAccessKey")}
          </Label>
          <Input
            id="aws_secret_access_key"
            name="aws_secret_access_key"
            type="password"
            placeholder={t("settings.secrets.providerConfig.aws.useIamRole")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AzureConfig() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.secrets.providerConfig.azure.configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="azure_vault_url">
            {t("settings.secrets.providerConfig.azure.vaultUrl")} *
          </Label>
          <Input
            id="azure_vault_url"
            name="azure_vault_url"
            type="text"
            required
            placeholder="https://myvault.vault.azure.net"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="azure_tenant_id">
            {t("settings.secrets.providerConfig.azure.tenantId")}
          </Label>
          <Input
            id="azure_tenant_id"
            name="azure_tenant_id"
            type="text"
            placeholder={t("settings.secrets.providerConfig.azure.useManagedIdentity")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="azure_client_id">
            {t("settings.secrets.providerConfig.azure.clientId")}
          </Label>
          <Input
            id="azure_client_id"
            name="azure_client_id"
            type="text"
            placeholder={t("settings.secrets.providerConfig.azure.useManagedIdentity")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="azure_client_secret">
            {t("settings.secrets.providerConfig.azure.clientSecret")}
          </Label>
          <Input
            id="azure_client_secret"
            name="azure_client_secret"
            type="password"
            placeholder={t("settings.secrets.providerConfig.azure.useManagedIdentity")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function GcpConfig() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.secrets.providerConfig.gcp.configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="gcp_project_id">
            {t("settings.secrets.providerConfig.gcp.projectId")} *
          </Label>
          <Input
            id="gcp_project_id"
            name="gcp_project_id"
            type="text"
            required
            placeholder="my-project-id"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="gcp_service_account_json">
            {t("settings.secrets.providerConfig.gcp.serviceAccountJson")}
          </Label>
          <textarea
            id="gcp_service_account_json"
            name="gcp_service_account_json"
            rows={4}
            placeholder={t("settings.secrets.providerConfig.gcp.useDefaultCredentials")}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function KubernetesConfig() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.secrets.providerConfig.kubernetes.configuration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="k8s_namespace">
            {t("settings.secrets.providerConfig.kubernetes.namespace")} *
          </Label>
          <Input
            id="k8s_namespace"
            name="k8s_namespace"
            type="text"
            required
            defaultValue="default"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="k8s_kubeconfig">
            {t("settings.secrets.providerConfig.kubernetes.kubeconfigPath")}
          </Label>
          <Input
            id="k8s_kubeconfig"
            name="k8s_kubeconfig"
            type="text"
            placeholder={t("settings.secrets.providerConfig.kubernetes.useInClusterConfig")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function KmsConfig() {
  const { t } = useTranslation();
  const [kmsProvider, setKmsProvider] = useState<string>("vault");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.secrets.providerConfig.kms.configuration")}
        </CardTitle>
        <CardDescription className="text-xs">
          KMS (Key Management Service) encrypts data encryption keys (DEKs) for envelope encryption
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="kms_provider">
            {t("settings.secrets.providerConfig.kms.provider")} *
          </Label>
          <Select name="kms_provider" value={kmsProvider} onValueChange={setKmsProvider}>
            <SelectTrigger id="kms_provider">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vault">Vault KMS</SelectItem>
              <SelectItem value="aws">AWS KMS</SelectItem>
              <SelectItem value="azure">Azure Key Vault</SelectItem>
              <SelectItem value="gcp">Google Cloud KMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {kmsProvider === "vault" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="kms_vault_addr">
                Vault Address *
              </Label>
              <Input
                id="kms_vault_addr"
                name="kms_vault_addr"
                type="text"
                required
                placeholder="http://localhost:8200"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kms_vault_token">
                Vault Token *
              </Label>
              <Input
                id="kms_vault_token"
                name="kms_vault_token"
                type="password"
                required
                placeholder="s.xxxxxxxxxxxxx"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kms_vault_mount">
                Transit Mount Path
              </Label>
              <Input
                id="kms_vault_mount"
                name="kms_vault_mount"
                type="text"
                defaultValue="transit"
                placeholder="transit"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kms_key_name">
                Key Name *
              </Label>
              <Input
                id="kms_key_name"
                name="kms_key_name"
                type="text"
                required
                placeholder="my-master-key"
              />
            </div>
          </>
        )}

        {kmsProvider === "aws" && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="kms_aws_region">
                AWS Region *
              </Label>
              <Input
                id="kms_aws_region"
                name="kms_aws_region"
                type="text"
                required
                placeholder="us-east-1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kms_key_id">
                KMS Key ID or ARN *
              </Label>
              <Input
                id="kms_key_id"
                name="kms_key_id"
                type="text"
                required
                placeholder="alias/my-key or arn:aws:kms:..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kms_aws_access_key">
                AWS Access Key ID
              </Label>
              <Input
                id="kms_aws_access_key"
                name="kms_aws_access_key"
                type="text"
                placeholder="Leave empty to use IAM role"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kms_aws_secret_key">
                AWS Secret Access Key
              </Label>
              <Input
                id="kms_aws_secret_key"
                name="kms_aws_secret_key"
                type="password"
                placeholder="Leave empty to use IAM role"
              />
            </div>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
          <strong>ℹ️ KMS Integration:</strong> This enables envelope encryption where data is encrypted with DEKs, 
          and DEKs are encrypted with your KMS master key. All crypto operations happen on the backend.
        </div>
      </CardContent>
    </Card>
  );
}

function EditProviderModal({
  provider,
  onClose,
  isLoading,
}: {
  provider: ProviderConfig;
  onClose: () => void;
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t("settings.secrets.providerConfig.editProvider")}: {provider.name}
        </DialogTitle>
        <DialogDescription>
          {t("settings.secrets.providerConfig.editProviderDescription")}
        </DialogDescription>
      </DialogHeader>

      <Form method="post">
        <input type="hidden" name="_action" value="update" />
        <input type="hidden" name="id" value={provider.id} />

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="edit_name">
              {t("settings.secrets.form.name")} *
            </Label>
            <Input
              id="edit_name"
              name="name"
              required
              defaultValue={provider.name}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              defaultChecked={provider.enabled}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="enabled" className="cursor-pointer">
              {t("settings.secrets.providerConfig.enableProvider")}
            </Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit_priority">
              {t("settings.secrets.providerConfig.priority")}
            </Label>
            <Input
              id="edit_priority"
              name="priority"
              type="number"
              min="1"
              defaultValue={provider.priority}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {t("common.save")}
          </Button>
        </DialogFooter>
      </Form>
    </>
  );
}
