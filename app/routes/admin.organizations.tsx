import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { useState } from "react";

// Mock data for now - will connect to backend later
interface Organization {
  id: string;
  name: string;
  code: string;
  type: "Hospital" | "Clinic" | "Lab" | "Pharmacy";
  address: string;
  contact: string;
  is_active: boolean;
}

export async function loader() {
  // Mock data - replace with actual API call
  const organizations: Organization[] = [];
  return json({ organizations });
}

export default function OrganizationsPage() {
  const { organizations } = useLoaderData<typeof loader>();
  const [isAddingOrg, setIsAddingOrg] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #1A0030 0%, #2C004D 50%, #5A00C0 100%)" }}>
      {/* Header */}
      <div className="border-b backdrop-blur-sm bg-white/10" style={{ borderColor: "#00A9FF" }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="OpenHIMS" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-white">OpenHIMS</h1>
                <p className="text-sm" style={{ color: "#60FFFF" }}>Organizations & Hospitals</p>
              </div>
            </Link>
            
            <nav className="flex gap-4">
              <Link 
                to="/admin/organizations"
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: "#5A00C0" }}
              >
                Organizations
              </Link>
              <Link 
                to="/admin/resources"
                className="px-4 py-2 rounded-lg font-medium text-white hover:bg-white/10"
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
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Organizations</h2>
            <p className="text-lg" style={{ color: "#60FFFF" }}>
              Manage hospitals, clinics, labs, and pharmacies
            </p>
          </div>
          
          <button
            onClick={() => setIsAddingOrg(true)}
            className="px-6 py-3 rounded-lg font-medium text-white shadow-lg hover:scale-105 transition-all"
            style={{ 
              backgroundColor: "#00A9FF",
              boxShadow: "0 4px 20px rgba(0, 169, 255, 0.4)"
            }}
          >
            ➕ Add Organization
          </button>
        </div>

        {/* Organizations Grid */}
        {organizations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-12 rounded-2xl backdrop-blur-sm border" style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "#00A9FF"
            }}>
              <p className="text-2xl text-white mb-4">🏥 No organizations yet</p>
              <p className="text-lg mb-6" style={{ color: "#60FFFF" }}>
                Get started by adding your first hospital or clinic
              </p>
              <button
                onClick={() => setIsAddingOrg(true)}
                className="px-8 py-3 rounded-lg font-medium text-white shadow-lg hover:scale-105 transition-all"
                style={{ 
                  backgroundColor: "#00A9FF",
                  boxShadow: "0 4px 20px rgba(0, 169, 255, 0.4)"
                }}
              >
                Add Organization
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} organization={org} />
            ))}
          </div>
        )}
      </div>

      {/* Add Organization Modal */}
      {isAddingOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(26, 0, 48, 0.9)" }}>
          <div 
            className="w-full max-w-2xl p-8 rounded-2xl backdrop-blur-md border"
            style={{
              backgroundColor: "rgba(26, 0, 48, 0.95)",
              borderColor: "#00A9FF",
              boxShadow: "0 20px 60px rgba(0, 169, 255, 0.3)"
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add Organization</h3>
              <button
                onClick={() => setIsAddingOrg(false)}
                className="text-white hover:text-red-400 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <OrganizationForm onClose={() => setIsAddingOrg(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function OrganizationCard({ organization }: { organization: Organization }) {
  const typeColors = {
    Hospital: { bg: "#5A00C0", icon: "🏥" },
    Clinic: { bg: "#00A3B5", icon: "🏥" },
    Lab: { bg: "#00A9FF", icon: "🔬" },
    Pharmacy: { bg: "#FFA500", icon: "💊" },
  };

  const config = typeColors[organization.type];

  return (
    <div
      className="p-6 rounded-lg backdrop-blur-sm border hover:scale-105 transition-all"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderColor: "#00A9FF",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{config.icon}</span>
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2"
              style={{ backgroundColor: config.bg, color: "#ffffff" }}
            >
              {organization.type}
            </span>
            <h3 className="text-xl font-bold text-white">{organization.name}</h3>
            <p className="text-sm font-mono" style={{ color: "#60FFFF" }}>
              {organization.code}
            </p>
          </div>
        </div>
        {organization.is_active && (
          <span
            className="px-2 py-1 rounded text-xs font-bold"
            style={{ backgroundColor: "#60FFFF", color: "#1A0030" }}
          >
            ACTIVE
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm" style={{ color: "#A0FFFF" }}>
          📍 {organization.address}
        </p>
        <p className="text-sm" style={{ color: "#A0FFFF" }}>
          📞 {organization.contact}
        </p>
      </div>

      <div className="flex gap-2 pt-4 border-t" style={{ borderColor: "rgba(0, 169, 255, 0.2)" }}>
        <button
          className="flex-1 px-3 py-2 rounded text-sm font-medium hover:scale-105 transition-all"
          style={{ backgroundColor: "#00A9FF", color: "#ffffff" }}
        >
          View Details
        </button>
        <button
          className="px-3 py-2 rounded text-sm font-medium hover:scale-105 transition-all"
          style={{ backgroundColor: "#5A00C0", color: "#ffffff" }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function OrganizationForm({ onClose }: { onClose: () => void }) {
  return (
    <Form method="post" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Organization Type
          </label>
          <select
            name="type"
            required
            className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#00A9FF"
            }}
          >
            <option value="Hospital">Hospital</option>
            <option value="Clinic">Clinic</option>
            <option value="Lab">Laboratory</option>
            <option value="Pharmacy">Pharmacy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Organization Code
          </label>
          <input
            type="text"
            name="code"
            required
            placeholder="ORG-001"
            className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#00A9FF"
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Organization Name
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="General Hospital"
          className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#00A9FF"
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Address
        </label>
        <textarea
          name="address"
          required
          rows={2}
          placeholder="123 Medical Center Drive, City, State, ZIP"
          className="w-full px-4 py-2 rounded-lg backdrop-blur-sm text-white border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "#00A9FF"
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Contact
        </label>
        <input
          type="text"
          name="contact"
          required
          placeholder="contact@hospital.com or +1 (555) 123-4567"
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
          name="is_active"
          id="is_active"
          defaultChecked
          className="w-4 h-4"
        />
        <label htmlFor="is_active" className="text-sm text-white">
          Active Organization
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-lg font-medium border hover:scale-105 transition-all"
          style={{
            borderColor: "#00A9FF",
            color: "#60FFFF"
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 rounded-lg font-medium text-white shadow-lg hover:scale-105 transition-all"
          style={{
            backgroundColor: "#00A9FF",
            boxShadow: "0 4px 20px rgba(0, 169, 255, 0.4)"
          }}
        >
          Create Organization
        </button>
      </div>
    </Form>
  );
}
