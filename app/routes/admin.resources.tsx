import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { resourcesApi } from "~/lib/api.server";
import { useTranslation } from "~/hooks/useTranslation";
import { useResourceStore } from "~/stores/useResourceStore";
import type { Resource } from "~/types/permissions";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export const meta: MetaFunction = () => {
  return [
    { title: "Resources - RustCare Admin" },
    { name: "description", content: "Manage system resources and access controls" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const resources = await resourcesApi.list();
    return json({ resources, error: null });
  } catch (error) {
    return json({ 
      resources: [], 
      error: error instanceof Error ? error.message : "Failed to load resources" 
    });
  }
}

export default function ResourcesPage() {
  const { resources, error } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  
  // Use Zustand store for UI state
  const searchTerm = useResourceStore((state) => state.searchTerm);
  const setSearchTerm = useResourceStore((state) => state.setSearchTerm);
  const filterType = useResourceStore((state) => state.filterType);
  const setFilterType = useResourceStore((state) => state.setFilterType);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource?.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || resource?.resource_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #1A0030 0%, #2C004D 50%, #5A00C0 100%)" }}>
      {/* Header */}
      <div className="border-b backdrop-blur-sm bg-white/10" style={{ borderColor: "#00A9FF" }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="OpenHIMS" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-white">OpenHIMS</h1>
                <p className="text-sm" style={{ color: "#60FFFF" }}>Permission Management</p>
              </div>
            </Link>
            
            <nav className="flex gap-4">
              <Link 
                to="/admin/resources"
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: "#5A00C0" }}
              >
                Resources
              </Link>
              <Link 
                to="/admin/groups"
                className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/10"
              >
                Groups
              </Link>
              <Link 
                to="/admin/roles"
                className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/10"
              >
                Roles
              </Link>
              <Link 
                to="/admin/users"
                className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/10"
              >
                Users
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border"
            style={{ 
              backgroundColor: "rgba(216, 0, 216, 0.1)",
              borderColor: "#D800D8",
              color: "#FF00FF"
            }}
          >
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t("resources.title")}</h1>
          <p className="text-lg" style={{ color: "#60FFFF" }}>
            {t("resources.subtitle")}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex gap-4 flex-wrap items-center">
          {/* Search */}
          <input
            type="text"
            placeholder={t("resources.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[300px] px-4 py-2 rounded-lg backdrop-blur-sm text-white placeholder-white/60 border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#00A9FF"
            }}
          />

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#00A9FF"
            }}
          >
            <option value="all">{t("resources.allTypes")}</option>
            <option value="Screen">{t("resources.type.screen")}</option>
            <option value="Api">{t("resources.type.api")}</option>
            <option value="Module">{t("resources.type.module")}</option>
            <option value="Entity">{t("resources.type.entity")}</option>
          </select>

          {/* Add Button */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="px-6 py-2 rounded-lg font-medium text-white shadow-lg hover:scale-105 transition-all"
                style={{ 
                  backgroundColor: "#00A9FF",
                  boxShadow: "0 4px 20px rgba(0, 169, 255, 0.4)"
                }}
              >
                ➕ {t("resources.add")}
              </button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-md" style={{ backgroundColor: "rgba(26, 0, 48, 0.95)", borderColor: "#00A9FF" }}>
              <DialogHeader>
                <DialogTitle className="text-white">{t("resources.create")}</DialogTitle>
                <DialogDescription style={{ color: "#60FFFF" }}>
                  {t("resources.subtitle")}
                </DialogDescription>
              </DialogHeader>
              <ResourceForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => resource ? (
            <ResourceCard key={resource.id} resource={resource} />
          ) : null)}
          {filteredResources.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-white/60">{t("resources.noResults")}</p>
              <p style={{ color: "#60FFFF" }}>{t("resources.adjustFilters")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const { t } = useTranslation();
  const typeColors = {
    Screen: { bg: "#5A00C0", border: "#7A00FF" },
    Api: { bg: "#00A3B5", border: "#00D4FF" },
    Module: { bg: "#00A9FF", border: "#00D4FF" },
    Entity: { bg: "#FFA500", border: "#FFD700" },
  };

  const colors = typeColors[resource.resource_type];

  return (
    <div
      className="p-6 rounded-lg backdrop-blur-sm border hover:scale-105 transition-all"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: colors.border,
        boxShadow: `0 4px 20px ${colors.bg}40`
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
            style={{ backgroundColor: colors.bg, color: "#ffffff" }}
          >
            {t(`resources.type.${resource.resource_type.toLowerCase()}`)}
          </span>
          <h3 className="text-xl font-bold text-white">{resource.name}</h3>
        </div>
        {resource.contains_phi && (
          <span
            className="px-2 py-1 rounded text-xs font-bold"
            style={{ backgroundColor: "#D800D8", color: "#ffffff" }}
          >
            {t("resources.phi")}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm mb-4" style={{ color: "#A0FFFF" }}>
        {resource.description}
      </p>

      {/* Path */}
      <p className="text-xs font-mono mb-3" style={{ color: "#60FFFF" }}>
        {resource.path}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.actions.map((action) => (
          <span
            key={action}
            className="px-2 py-1 rounded text-xs font-medium backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(0, 163, 181, 0.2)",
              color: "#60FFFF",
              border: "1px solid #00A3B5"
            }}
          >
            {action}
          </span>
        ))}
      </div>

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#A0FFFF"
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex gap-2 pt-4 border-t" style={{ borderColor: "rgba(0, 169, 255, 0.2)" }}>
        <button
          className="flex-1 px-3 py-2 rounded text-sm font-medium hover:scale-105 transition-all"
          style={{ backgroundColor: "#00A9FF", color: "#ffffff" }}
        >
          {t("resources.edit")}
        </button>
        <button
          className="px-3 py-2 rounded text-sm font-medium hover:scale-105 transition-all"
          style={{ backgroundColor: "#D800D8", color: "#ffffff" }}
        >
          {t("resources.delete")}
        </button>
      </div>
    </div>
  );
}

function ResourceForm() {
  const { t } = useTranslation();
  
  return (
    <Form method="post" className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {t("resources.form.resourceType")}
        </label>
        <select
          name="resource_type"
          required
          className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#00A9FF"
          }}
        >
          <option value="Screen">{t("resources.type.screen")}</option>
          <option value="Api">{t("resources.type.api")}</option>
          <option value="Module">{t("resources.type.module")}</option>
          <option value="Entity">{t("resources.type.entity")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {t("resources.form.name")}
        </label>
        <input
          type="text"
          name="name"
          required
          className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#00A9FF"
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {t("resources.form.description")}
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#00A9FF"
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {t("resources.form.path")}
        </label>
        <input
          type="text"
          name="path"
          required
          placeholder={t("resources.form.pathPlaceholder")}
          className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#00A9FF"
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {t("resources.form.actions")}
        </label>
        <input
          type="text"
          name="actions"
          placeholder={t("resources.form.actionsPlaceholder")}
          className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#00A9FF"
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="contains_phi"
          id="contains_phi"
          className="w-4 h-4"
        />
        <label htmlFor="contains_phi" className="text-sm text-white">
          {t("resources.form.containsPhi")}
        </label>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 rounded-lg font-medium text-white shadow-lg hover:scale-105 transition-all"
        style={{
          backgroundColor: "#00A9FF",
          boxShadow: "0 4px 20px rgba(0, 169, 255, 0.4)"
        }}
      >
        {t("resources.create")}
      </button>
    </Form>
  );
}
