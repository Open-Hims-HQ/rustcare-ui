import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import {
  ShieldCheck,
  Key,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RotateCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { PermissionGuard, PermissionButton } from "~/components/PermissionGuard";
import { usePermission, useAllowedActions } from "~/hooks/usePermissions";
import { PERMISSIONS } from "~/lib/permissions";
import { validateRequest, requirePermission, logAudit } from "~/lib/security.server";

interface Secret {
  key: string;
  version?: string;
  created_at?: string;
  updated_at?: string;
  rotation_enabled: boolean;
  rotation_interval_days?: number;
  tags: Record<string, string>;
}

interface Provider {
  name: string;
  type: string;
  healthy: boolean;
  message: string;
  latency_ms: number;
}

interface SecretsData {
  secrets: Secret[];
  providers: Provider[];
  health: {
    healthy: boolean;
    message: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Validate user has permission to list secrets
  const user = await validateRequest(request, {
    requireAuth: true,
    requirePermission: { resource: 'secret', action: 'list' },
  });

  // TODO: Replace with actual API call to rustcare-engine
  const data: SecretsData = {
    secrets: [
      {
        key: "database/password",
        version: "1",
        created_at: "2025-10-20T10:00:00Z",
        updated_at: "2025-10-20T10:00:00Z",
        rotation_enabled: true,
        rotation_interval_days: 30,
        tags: { environment: "production", service: "database" },
      },
      {
        key: "api/stripe-key",
        version: "2",
        created_at: "2025-10-15T10:00:00Z",
        updated_at: "2025-10-25T10:00:00Z",
        rotation_enabled: false,
        tags: { environment: "production", service: "payment" },
      },
    ],
    providers: [
      {
        name: "vault",
        type: "HashiCorp Vault",
        healthy: true,
        message: "Vault is healthy",
        latency_ms: 15,
      },
      {
        name: "aws-secrets-manager",
        type: "AWS Secrets Manager",
        healthy: true,
        message: "AWS Secrets Manager is healthy",
        latency_ms: 45,
      },
    ],
    health: {
      healthy: true,
      message: "All providers healthy",
    },
  };

  return json({ ...data, user });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const key = formData.get("key")?.toString();

  // Get user for audit logging
  const user = await validateRequest(request, { requireAuth: true });

  // TODO: Implement actual API calls
  switch (action) {
    case "create":
      await requirePermission(request, 'secret', 'create');
      await logAudit(request, {
        userId: user?.userId,
        action: 'secret_created',
        resource: 'secret',
        resourceId: key,
        success: true,
      });
      return json({ success: true, message: "Secret created successfully" });
      
    case "update":
      await requirePermission(request, 'secret', 'update');
      await logAudit(request, {
        userId: user?.userId,
        action: 'secret_updated',
        resource: 'secret',
        resourceId: key,
        success: true,
      });
      return json({ success: true, message: "Secret updated successfully" });
      
    case "delete":
      await requirePermission(request, 'secret', 'delete');
      await logAudit(request, {
        userId: user?.userId,
        action: 'secret_deleted',
        resource: 'secret',
        resourceId: key,
        success: true,
      });
      return json({ success: true, message: "Secret deleted successfully" });
      
    case "rotate":
      await requirePermission(request, 'secret', 'rotate');
      await logAudit(request, {
        userId: user?.userId,
        action: 'secret_rotated',
        resource: 'secret',
        resourceId: key,
        success: true,
      });
      return json({ success: true, message: "Secret rotated successfully" });
    default:
      return json({ success: false, message: "Invalid action" }, { status: 400 });
  }
}

export default function SecretsManagement() {
  const { secrets, providers, health } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const [showSecretValue, setShowSecretValue] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading = navigation.state === "submitting";

  const filteredSecrets = secrets.filter((secret) =>
    secret.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-purple-600" />
                Secrets Management
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage secrets across multiple providers with encryption, rotation, and audit logging
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Secret
            </button>
          </div>
        </div>

        {/* Action Feedback */}
        {actionData && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              actionData.success
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {actionData.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {actionData.message}
          </div>
        )}

        {/* Health Status */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-lg border ${
              health.healthy
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Health</p>
                <p className={`text-2xl font-bold ${health.healthy ? "text-green-600" : "text-red-600"}`}>
                  {health.healthy ? "Healthy" : "Unhealthy"}
                </p>
              </div>
              {health.healthy ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <AlertCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
          </div>

          {providers.map((provider) => (
            <div
              key={provider.name}
              className={`p-4 rounded-lg border ${
                provider.healthy
                  ? "bg-white border-gray-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{provider.type}</p>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    provider.healthy
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {provider.healthy ? "Healthy" : "Unhealthy"}
                </span>
              </div>
              <p className="text-xs text-gray-500">{provider.message}</p>
              <p className="text-xs text-gray-400 mt-1">Latency: {provider.latency_ms}ms</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search secrets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Secrets List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Secrets</h2>
            <p className="text-sm text-gray-600">
              {filteredSecrets.length} secret{filteredSecrets.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredSecrets.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Key className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No secrets found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new secret.
                </p>
              </div>
            ) : (
              filteredSecrets.map((secret) => (
                <div key={secret.key} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Key className="h-5 w-5 text-purple-600" />
                        <h3 className="text-sm font-medium text-gray-900">{secret.key}</h3>
                        {secret.rotation_enabled && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Auto-Rotation
                          </span>
                        )}
                      </div>

                      <div className="ml-8 space-y-1">
                        <p className="text-xs text-gray-500">
                          Version: {secret.version || "N/A"}
                        </p>
                        {secret.rotation_interval_days && (
                          <p className="text-xs text-gray-500">
                            Rotates every {secret.rotation_interval_days} days
                          </p>
                        )}
                        {secret.updated_at && (
                          <p className="text-xs text-gray-500">
                            Last updated: {new Date(secret.updated_at).toLocaleDateString()}
                          </p>
                        )}
                        {Object.keys(secret.tags).length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {Object.entries(secret.tags).map(([key, value]) => (
                              <span
                                key={key}
                                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                              >
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowSecretValue({
                            ...showSecretValue,
                            [secret.key]: !showSecretValue[secret.key],
                          });
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title={showSecretValue[secret.key] ? "Hide value" : "Show value"}
                      >
                        {showSecretValue[secret.key] ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                      <Form method="post">
                        <input type="hidden" name="_action" value="rotate" />
                        <input type="hidden" name="key" value={secret.key} />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Rotate secret"
                        >
                          <RotateCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                      </Form>

                      <Form method="post">
                        <input type="hidden" name="_action" value="delete" />
                        <input type="hidden" name="key" value={secret.key} />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete secret"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </Form>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Secret Modal */}
        {showCreateModal && (
          <CreateSecretModal
            onClose={() => setShowCreateModal(false)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

function CreateSecretModal({
  onClose,
  isLoading,
}: {
  onClose: () => void;
  isLoading: boolean;
}) {
  const [rotationEnabled, setRotationEnabled] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Secret</h2>
        </div>

        <Form method="post" className="px-6 py-4">
          <input type="hidden" name="_action" value="create" />

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key *
              </label>
              <input
                type="text"
                name="key"
                required
                placeholder="e.g., database/password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use forward slashes to organize secrets (e.g., service/environment/name)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Value *
              </label>
              <textarea
                name="value"
                required
                rows={4}
                placeholder="Enter the secret value (will be encrypted)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rotationEnabled"
                checked={rotationEnabled}
                onChange={(e) => setRotationEnabled(e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="rotationEnabled" className="text-sm font-medium text-gray-700">
                Enable automatic rotation
              </label>
            </div>

            {rotationEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rotation Interval (days)
                </label>
                <input
                  type="number"
                  name="rotation_interval_days"
                  min="1"
                  max="365"
                  defaultValue="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (optional)
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="tag_key_1"
                    placeholder="Key (e.g., environment)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="text"
                    name="tag_value_1"
                    placeholder="Value (e.g., production)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <RotateCw className="h-4 w-4 animate-spin" />}
              Create Secret
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
