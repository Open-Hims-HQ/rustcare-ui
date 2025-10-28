import { Outlet, NavLink } from "@remix-run/react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { ShieldCheck, Server, FileText, Key, Users, Building, Lock } from "lucide-react";
import { PERMISSIONS } from "~/lib/permissions";
import { validateRequest } from "~/lib/security.server";
import { cn } from "~/lib/utils";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useTranslation } from "~/hooks/useTranslation";

export const meta: MetaFunction = () => {
  return [
    { title: "Settings - RustCare" },
    { name: "description", content: "RustCare Settings and Configuration" },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Validate and get user
  const user = await validateRequest(request, {
    requireAuth: true,
  });

  return Response.json({ user });
}

export default function SettingsLayout() {
  const { t } = useTranslation();

  const navItems = [
    {
      to: "/settings/secrets",
      labelKey: "settings.secrets.listTab",
      icon: Key,
      permission: PERMISSIONS.LIST_SECRETS,
      descriptionKey: "settings.secrets.description"
    },
    {
      to: "/settings/secrets/providers",
      labelKey: "settings.secrets.providersTab",
      icon: Server,
      permission: PERMISSIONS.READ_PROVIDER,
      descriptionKey: "settings.secrets.providerConfig.description"
    },
    {
      to: "/settings/secrets/audit",
      labelKey: "settings.secrets.auditTab",
      icon: FileText,
      permission: PERMISSIONS.READ_AUDIT,
      descriptionKey: "settings.secrets.auditLog.description"
    },
    {
      to: "/settings/users",
      labelKey: "employees.title",
      icon: Users,
      permission: { resource: 'user' as const, action: 'list' as const },
      descriptionKey: "employees.viewDetails"
    },
    {
      to: "/settings/organizations",
      labelKey: "organizations.title",
      icon: Building,
      permission: { resource: 'organization' as const, action: 'list' as const },
      descriptionKey: "organizations.subtitle"
    },
    {
      to: "/settings/security",
      labelKey: "settings.security",
      icon: Lock,
      permission: { resource: 'secret_provider' as const, action: 'configure' as const },
      descriptionKey: "settings.subtitle"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Skip to main content link for WCAG 2.4.1 Bypass Blocks */}
      <a
        href="#settings-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        {t("accessibility.skipToMain")}
      </a>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with semantic HTML for WCAG 1.3.1 Info and Relationships */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("settings.title")}
            </h1>
          </div>
          <p className="text-slate-600 text-sm">
            {t("settings.subtitle")}
          </p>
        </header>

        <Separator className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation with ARIA landmarks */}
          <aside 
            className="lg:w-64 flex-shrink-0" 
            role="navigation" 
            aria-label={t("navigation.settings")}
          >
            <Card className="lg:sticky lg:top-4 shadow-sm" permission="settings:view">
              <nav className="p-2">
                <ul className="space-y-1" role="list">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group",
                            "hover:bg-slate-100 hover:text-slate-900",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                            isActive
                              ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                              : "text-slate-700"
                          )
                        }
                        aria-label={`${t(item.labelKey)}: ${t(item.descriptionKey)}`}
                      >
                        <item.icon 
                          className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" 
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{t(item.labelKey)}</div>
                          <div className="text-xs text-slate-500 group-hover:text-slate-600 truncate">
                            {t(item.descriptionKey)}
                          </div>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </Card>
          </aside>

          {/* Main Content with ARIA landmark for WCAG 2.4.1 */}
          <main 
            id="settings-content" 
            className="flex-1 min-w-0"
            role="main"
            aria-label={t("settings.subtitle")}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
