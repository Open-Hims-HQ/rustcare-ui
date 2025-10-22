import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "OpenHIMS — Permission Management" },
    { name: "description", content: "Open Healthcare Interoperability with Zanzibar-based permissions" },
  ];
};

export default function Index() {
  return (
    <div 
      className="flex min-h-screen items-center justify-center"
      style={{
        background: `linear-gradient(135deg, #1A0030 0%, #2C004D 25%, #5A00C0 50%, #007B8C 75%, #00A3B5 100%)`
      }}
    >
      <div className="flex flex-col items-center gap-8 px-4 py-12">
        {/* Brand Header with Logo */}
        <div className="text-center space-y-4 animate-fade-in">
          <img 
            src="/logo.png" 
            alt="OpenHIMS Logo" 
            className="w-48 h-48 mx-auto object-contain drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(96, 255, 255, 0.5))'
            }}
          />
          <h1 
            className="text-6xl font-bold tracking-tight"
            style={{ color: '#ffffff' }}
          >
            OpenHIMS
          </h1>
          <p className="text-xl font-medium" style={{ color: '#A0FFFF' }}>
            Healthcare, Simplified.
          </p>
        </div>
        
        {/* Subtitle */}
        <div className="text-center max-w-2xl backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#ffffff' }}>
            Permission Management
          </h2>
          <p className="text-lg" style={{ color: '#60FFFF' }}>
            Zanzibar-based access control for healthcare interoperability
          </p>
        </div>
        
        {/* Action Buttons - Using Logo Colors */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link
            to="/admin/resources"
            className="group rounded-lg px-6 py-3 font-medium text-white hover:scale-105 transition-all shadow-lg backdrop-blur-sm border"
            style={{ 
              backgroundColor: '#5A00C0',
              borderColor: '#7A00FF',
              boxShadow: '0 4px 20px rgba(122, 0, 255, 0.4)'
            }}
          >
            📋 Manage Resources
          </Link>
          <Link
            to="/admin/groups"
            className="group rounded-lg px-6 py-3 font-medium text-white hover:scale-105 transition-all shadow-lg backdrop-blur-sm border"
            style={{ 
              backgroundColor: '#00A3B5',
              borderColor: '#00D4FF',
              boxShadow: '0 4px 20px rgba(0, 163, 181, 0.4)'
            }}
          >
            👥 Manage Groups
          </Link>
          <Link
            to="/admin/roles"
            className="group rounded-lg px-6 py-3 font-medium text-white hover:scale-105 transition-all shadow-lg backdrop-blur-sm border"
            style={{ 
              backgroundColor: '#00A9FF',
              borderColor: '#00D4FF',
              boxShadow: '0 4px 20px rgba(0, 169, 255, 0.4)'
            }}
          >
            🔐 Manage Roles
          </Link>
          <Link
            to="/admin/users"
            className="group rounded-lg px-6 py-3 font-medium hover:scale-105 transition-all shadow-lg backdrop-blur-sm border"
            style={{ 
              backgroundColor: '#FFA500',
              borderColor: '#FFD700',
              color: '#1A0030',
              boxShadow: '0 4px 20px rgba(255, 165, 0, 0.4)'
            }}
          >
            👤 Manage Users
          </Link>
        </div>
        
        {/* Feature Tags - Logo Colors */}
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          <span 
            className="px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border"
            style={{ 
              backgroundColor: '#60FFFF',
              color: '#1A0030',
              borderColor: '#A0FFFF',
              boxShadow: '0 0 15px rgba(96, 255, 255, 0.5)'
            }}
          >
            ✓ HIPAA Compliant
          </span>
          <span 
            className="px-4 py-2 rounded-full text-sm font-bold text-white backdrop-blur-sm border"
            style={{ 
              backgroundColor: '#00A3B5',
              borderColor: '#00D4FF',
              boxShadow: '0 0 15px rgba(0, 163, 181, 0.5)'
            }}
          >
            HL7 FHIR R4+
          </span>
          <span 
            className="px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border"
            style={{ 
              backgroundColor: '#FFA500',
              color: '#1A0030',
              borderColor: '#FFD700',
              boxShadow: '0 0 15px rgba(255, 165, 0, 0.5)'
            }}
          >
            Built with Rust
          </span>
        </div>
      </div>
    </div>
  );
}
