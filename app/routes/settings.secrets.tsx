import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
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
  // This is now a layout component that renders child routes
  return <Outlet />;
}
