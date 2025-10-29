import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import {
  Shield,
  Zap,
  Lock,
  Activity,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  ArrowRight,
  Github,
  Users,
  Workflow,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  Accessibility,
  Languages,
} from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "RustCare - Enterprise Healthcare Platform Built with Rust" },
    {
      name: "description",
      content:
        "Open-source, HIPAA-compliant healthcare management platform. Security-first architecture with sub-millisecond performance.",
    },
  ];
};

// Add loader with caching for better performance
export async function loader({ request }: LoaderFunctionArgs) {
  // Pre-compute static data for the landing page
  const data = {
    timestamp: new Date().toISOString(),
    cacheDuration: 60, // 1 minute cache
  };

  return json(data, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60",
      "CDN-Cache-Control": "public, max-age=60",
      "Vercel-CDN-Cache-Control": "public, max-age=60",
    },
  });
}

export default function LandingPage() {
  const data = useLoaderData<typeof loader>();

  // Memoize expensive computations to prevent unnecessary re-renders
  const memoizedFeatures = useMemo(() => features, []);
  const memoizedArchitectureLayers = useMemo(() => architectureLayers, []);
  const memoizedSecurityFeatures = useMemo(() => securityFeatures, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                RustCare
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#architecture" className="text-gray-600 hover:text-gray-900 transition-colors">
                Architecture
              </a>
              <a href="#comparison" className="text-gray-600 hover:text-gray-900 transition-colors">
                Why RustCare
              </a>
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">
                Security
              </a>
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-block">
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  100% Open Source • Apache 2.0 License
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Making Healthcare
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Affordable for Everyone
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Healthcare is too expensive. We're open-sourcing enterprise-grade 
                healthcare software to save costs for patients and providers worldwide.
              </p>

              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                <p className="text-lg text-gray-900 leading-relaxed">
                  <span className="font-bold text-amber-700">"Why Open Source?"</span> 
                  <br />
                  As developers, we see healthcare costs skyrocketing. By open-sourcing 
                  this platform, we eliminate expensive licensing fees, reduce IT costs, 
                  and make quality healthcare accessible to everyone—from small clinics 
                  in rural areas to large hospitals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Building
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://github.com/open-hims"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Github className="h-5 w-5" />
                  View on GitHub
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10,000+</div>
                  <div className="text-sm text-gray-600">Requests/sec</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">&lt;1ms</div>
                  <div className="text-sm text-gray-600">Auth Latency</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">&lt;100MB</div>
                  <div className="text-sm text-gray-600">RAM Usage</div>
                </div>
              </div>

              {/* Raspberry Pi Highlight */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Runs on Raspberry Pi</h4>
                    <p className="text-sm text-gray-600">Deploy enterprise healthcare on edge devices</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Dashboard Preview */}
            <div className="relative animate-fade-in-up animation-delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  {/* Mock Terminal */}
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-2 text-green-400">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">$</span>
                        <span className="typing-animation">cargo run --release</span>
                      </div>
                      <div className="text-gray-500">
                        ✓ RustCare Engine started
                      </div>
                      <div className="text-gray-500">
                        ✓ Auth gateway listening on :8081
                      </div>
                      <div className="text-gray-500">
                        ✓ HIPAA audit logging enabled
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                        <span>All systems operational</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Zero-Trust
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Lock className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        AES-256
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Sub-ms
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                      <Database className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        HIPAA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Mission & Licensing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fully Open Source Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Licensed under Apache 2.0 - Free to use, modify, and distribute
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Our Mission */}
            <div className="p-8 bg-white rounded-2xl shadow-xl border-2 border-amber-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                Why We Built This
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong>Healthcare shouldn't bankrupt families.</strong> Proprietary 
                  EMR/EHR systems cost hospitals $50,000-500,000+ per year in licensing 
                  fees. These costs get passed to patients.
                </p>
                <p>
                  As software developers, we saw an opportunity: <strong>What if we 
                  open-sourced enterprise healthcare software?</strong>
                </p>
                <p className="font-semibold text-amber-800">
                  By eliminating licensing fees and vendor lock-in, we can save the 
                  healthcare industry billions—money that should go to patient care, 
                  not software licenses.
                </p>
              </div>
            </div>

            {/* Apache 2.0 License */}
            <div className="p-8 bg-white rounded-2xl shadow-xl border-2 border-blue-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                Apache 2.0 License
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Free Commercial Use</strong>
                    <p className="text-sm text-gray-600">Use in your clinic, hospital, or business without fees</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Modify & Customize</strong>
                    <p className="text-sm text-gray-600">Adapt the code to your specific needs and workflows</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Patent Protection</strong>
                    <p className="text-sm text-gray-600">Contributors grant patent rights, protecting you legally</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">No Vendor Lock-in</strong>
                    <p className="text-sm text-gray-600">Own your data, control your infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance & Contributions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Healthcare Compliance</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  HIPAA compliant architecture and audit trails
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  GDPR ready for European healthcare providers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  FDA 21 CFR Part 11 compatible for medical devices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  WHO (World Health Organization) regulations support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  HL7 FHIR R4+ standards for interoperability
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ICD-10/11 coding support built-in
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Comprehensive audit logging for regulatory compliance
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4">How to Contribute</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Fork the repository and submit pull requests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Report bugs and suggest features via GitHub Issues
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Join our community discussions and forums
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Contribute medical knowledge and workflows
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  Help with documentation and translations
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white">
            <h3 className="text-3xl font-bold mb-4">Join the Movement</h3>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Help us make healthcare affordable. Every contribution saves lives and reduces costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/open-hims"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Github className="h-5 w-5" />
                Start Contributing
              </a>
              <a
                href="https://github.com/open-hims/rustcare-engine/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Users className="h-5 w-5" />
                Join Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Modular Healthcare Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pick and deploy only the modules you need—from simple clinic management to full hospital EHR
            </p>
          </div>

          {/* Hospital & Clinical Modules */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              Hospital & Clinical Modules
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📋 EMR/EHR System</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Electronic health records management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Patient demographics and history
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Clinical documentation
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🏥 PACS Integration</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    DICOM image storage and viewing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Radiology workflow management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Medical imaging archive
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🧪 Lab Information System</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Lab order management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Results tracking and reporting
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    HL7 interface for analyzers
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">💊 Pharmacy Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    e-Prescribing system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Drug inventory management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Interaction checking
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📅 Appointment Scheduling</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Patient booking system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Calendar management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Reminders and notifications
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-red-50 rounded-2xl border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">💰 Billing & Insurance</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ICD-10/11 coding
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Insurance claims processing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Payment tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Finance & Revenue Cycle */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              Finance & Revenue Cycle Management
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">💳 Patient Billing</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Invoice generation and tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Payment processing (cash, card, UPI)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Outstanding dues management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Partial payment tracking
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🏥 Insurance Claims</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Pre-authorization management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Claims submission (EDI 837)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Denial tracking and resubmission
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    TPA coordination
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📊 Accounts & GL</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    General ledger management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Accounts payable/receivable
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Trial balance and financial reports
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Budget tracking and variance analysis
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">💰 Revenue Analytics</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Department-wise revenue tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Doctor revenue sharing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Cost center analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Profitability reports
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🧾 Expense Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Vendor payment management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Purchase order tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Petty cash management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Expense approval workflow
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📈 Financial Reporting</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    P&L statement generation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Balance sheet reports
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Cash flow statements
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    GST/Tax compliance reports
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Clinical Departments */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              Clinical Departments & Specialties
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-white to-cyan-50 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🔬 Radiology Department</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    X-Ray, CT, MRI, Ultrasound management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    DICOM viewer integration
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Radiologist reporting system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Film management and printing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Appointment scheduling per modality
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-cyan-50 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🧬 Pathology Lab</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Sample collection and tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Test catalog with reference ranges
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Analyzer machine integration (HL7)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Result validation and approval
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Critical value alerts
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-cyan-50 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🏥 OPD Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Multi-specialty OPD support
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Token/queue management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Vitals recording (BP, temp, pulse)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Consultation notes and prescriptions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Follow-up scheduling
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-cyan-50 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🛏️ IPD/Ward Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Bed allocation and tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Admission and discharge workflow
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Daily treatment charts
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Medication administration records
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Nursing notes and observations
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-cyan-50 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🔪 Operation Theatre</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    OT scheduling and booking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Surgical procedure tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Anesthesia records
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Consumables usage tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Post-op recovery monitoring
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-cyan-50 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🚑 Emergency/Casualty</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Triage and priority management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Trauma case documentation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Ambulance coordination
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Critical care monitoring
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    MLC/medico-legal case handling
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inventory & Supply Chain */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              Inventory & Supply Chain Management
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📦 Central Store</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Stock management with min/max levels
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Batch and expiry tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Barcode/QR code scanning
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Automatic reorder notifications
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">💊 Pharmacy Inventory</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Medicine stock tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Narcotic drug register
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Generic substitution suggestions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Near-expiry alerts
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🏭 Purchase Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Purchase requisition workflow
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Vendor management and comparison
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    GRN (Goods Receipt Note)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Three-way matching (PO, GRN, Invoice)
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🔧 Asset Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Medical equipment tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Maintenance scheduling
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Calibration records
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Depreciation calculation
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🏭 Vendor & Biomedical Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Outsourced services tracking
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Biomedical equipment vendors
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Service contract management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Vendor performance tracking
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📊 Consumption Analysis</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Department-wise consumption
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ABC/VED analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Stock movement reports
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Wastage and expiry tracking
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🚚 Supply Chain</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Inter-department transfers
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Stock indents and issues
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Return and exchange management
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Cold chain monitoring
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Employee & Administration */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              Employee & Administration
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">👥 HR Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Employee onboarding and records
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Leave management system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Attendance and shift scheduling
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Performance appraisal
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">💵 Payroll System</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Salary structure configuration
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Tax calculation (TDS, PF, ESI)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Payslip generation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Bank integration for salary transfer
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🔐 Access Control</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Role-based permissions (Zanzibar)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Fine-grained authorization
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    OAuth 2.0 & SSO integration
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Audit trail for all actions
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Device Integration & Infrastructure */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Server className="h-6 w-6 text-white" />
              </div>
              Device Integration & Infrastructure
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🏥 Medical Device Manager</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    IoT device connectivity
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Real-time monitoring
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Serial device communication
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    WebSocket live data streams
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📱 Mobile Applications</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Essential features mobile app
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Control-based UI settings
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Patient self-service portal
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Healthcare provider mobile access
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🔌 HL7/FHIR Integration</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    HL7 v2.x message parsing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    FHIR R4+ REST API
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Interoperability standards
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    C-CDA document exchange
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">☁️ Flexible Deployment</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Docker containerization
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Kubernetes orchestration
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Cloud & on-premise support
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Multi-region deployment
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🛡️ Security & Compliance</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    AES-256-GCM encryption
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    HIPAA audit logging
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Multi-provider KMS
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Zero-trust architecture
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">📋 Audit Logs & Compliance</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Comprehensive audit trail system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    WHO regulations compliance
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Global health standards support
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Tamper-evident logging
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🔄 Workflow Automation</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    State machine orchestration
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Saga pattern for transactions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Scheduled tasks and cron
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Event-driven automation
                  </li>
                </ul>
              </div>

              <div className="group p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <h4 className="text-xl font-bold text-gray-900 mb-3">🧩 Custom Plugin System</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    WASM sandbox runtime
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Hot-plugging capabilities
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Custom module development
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    Plugin marketplace ready
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Plugin System & Extensibility */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Build Your Own Modules
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Extend the platform with custom plugins using WebAssembly—secure, fast, and language-agnostic
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* WASM Plugin Architecture */}
            <div className="p-8 bg-white rounded-2xl shadow-2xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Workflow className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">WebAssembly Plugins</h3>
                  <p className="text-sm text-gray-600">Secure sandboxed execution</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    Language Agnostic
                  </h4>
                  <p className="text-sm text-gray-600 ml-7">
                    Write plugins in Rust, C, C++, AssemblyScript, or any language that compiles to WASM
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    Sandboxed Execution
                  </h4>
                  <p className="text-sm text-gray-600 ml-7">
                    WASM provides memory isolation—malicious plugins can't access system resources or patient data
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    Near-Native Performance
                  </h4>
                  <p className="text-sm text-gray-600 ml-7">
                    WASM executes at near-native speed—perfect for compute-intensive medical algorithms
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    Hot Reload Support
                  </h4>
                  <p className="text-sm text-gray-600 ml-7">
                    Update plugins without restarting the server—zero downtime deployments
                  </p>
                </div>
              </div>
            </div>

            {/* Plugin Use Cases */}
            <div className="p-8 bg-white rounded-2xl shadow-2xl border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Plugin Use Cases</h3>
                  <p className="text-sm text-gray-600">Endless possibilities</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Custom Medical Algorithms</h5>
                    <p className="text-sm text-gray-600">Dosage calculators, risk scoring, clinical decision support</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Third-Party Integrations</h5>
                    <p className="text-sm text-gray-600">Connect to external labs, insurance portals, government registries</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Custom Reports & Analytics</h5>
                    <p className="text-sm text-gray-600">Hospital-specific KPIs, regulatory reports, custom dashboards</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">AI/ML Models</h5>
                    <p className="text-sm text-gray-600">Image analysis, diagnosis prediction, patient readmission risk</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Workflow Extensions</h5>
                    <p className="text-sm text-gray-600">Custom approval processes, automated notifications, triggers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Data Transformations</h5>
                    <p className="text-sm text-gray-600">Format converters, data validators, custom parsers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Device Drivers</h5>
                    <p className="text-sm text-gray-600">Support for proprietary medical devices and lab equipment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plugin Development Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Security First</h4>
              <p className="text-sm text-gray-600 mb-3">
                Every plugin runs in an isolated WASM sandbox with no access to system calls or file system
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Memory isolation enforced</li>
                <li>• Capability-based security model</li>
                <li>• Resource limits configurable</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Easy Development</h4>
              <p className="text-sm text-gray-600 mb-3">
                SDK with code templates, testing tools, and comprehensive documentation
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Plugin scaffolding CLI</li>
                <li>• Local testing environment</li>
                <li>• Debug mode with logging</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Plugin Registry</h4>
              <p className="text-sm text-gray-600 mb-3">
                Publish and discover community plugins via built-in marketplace
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Versioning and updates</li>
                <li>• Community ratings</li>
                <li>• Security audits available</li>
              </ul>
            </div>
          </div>

          {/* Code Example */}
          <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">Example: Custom Plugin in Rust</h4>
              <div className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                WASM Plugin
              </div>
            </div>
            <pre className="text-sm text-green-400 font-mono overflow-x-auto">
              <code>{`// Define your custom plugin
#[plugin_fn]
pub fn calculate_bmi(weight_kg: f64, height_m: f64) -> f64 {
    weight_kg / (height_m * height_m)
}

// Access patient data safely via API
#[plugin_fn]
pub fn get_patient_risk_score(patient_id: &str) -> Result<f64> {
    let vitals = api::get_patient_vitals(patient_id)?;
    let history = api::get_medical_history(patient_id)?;
    
    // Your custom risk calculation algorithm
    calculate_risk(vitals, history)
}

// Compile to WASM and deploy!
// $ cargo build --target wasm32-wasi --release`}</code>
            </pre>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href="https://github.com/open-hims/rustcare-engine/tree/main/plugin-runtime-core"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Workflow className="h-5 w-5" />
              Explore Plugin SDK
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* UI/UX & Accessibility Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Accessible & Secure UI
            </h2>
            <p className="text-xl text-gray-600">
              WCAG 2.1 AA compliant with advanced data masking
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Accessibility Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <Accessibility className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">WCAG 2.1 AA Compliance</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-emerald-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Screen Reader Support</h4>
                      <p className="text-sm text-gray-600">Full ARIA labels and semantic HTML for assistive technologies</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-emerald-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Keyboard Navigation</h4>
                      <p className="text-sm text-gray-600">Complete keyboard accessibility with focus indicators</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-emerald-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Color Contrast</h4>
                      <p className="text-sm text-gray-600">4.5:1 ratio for normal text, 3:1 for large text</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-emerald-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Internationalization (i18n)</h4>
                      <p className="text-sm text-gray-600">Multi-language support with RTL layouts (Arabic, Hebrew)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Masking Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <EyeOff className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Advanced Data Masking</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">PHI/PII Protection</h4>
                      <p className="text-sm text-gray-600">Automatic masking of sensitive patient data in UI</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Role-Based Masking</h4>
                      <p className="text-sm text-gray-600">Field-level visibility based on user permissions</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Redacted Logging</h4>
                      <p className="text-sm text-gray-600">Sensitive data automatically scrubbed from logs</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Audit Trail Protection</h4>
                      <p className="text-sm text-gray-600">Masked data in audit logs with unmask permissions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Modern Architecture
            </h2>
            <p className="text-xl text-gray-600">
              20+ specialized crates working in harmony
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {architectureLayers.map((layer, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${layer.color}`}>
                  <layer.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{layer.title}</h3>
                <ul className="space-y-2">
                  {layer.modules.map((module, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Showcase */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Zero-Trust Security Architecture
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              End-to-end zero-trust security from UI to backend. Every request authenticated, authorized, and audited.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {/* Frontend Zero-Trust */}
            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Frontend Security</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">JWT Token Validation</h4>
                    <p className="text-sm text-blue-100">Client-side token verification before API calls</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">CSRF Protection</h4>
                    <p className="text-sm text-blue-100">SameSite cookies with double-submit pattern</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Content Security Policy</h4>
                    <p className="text-sm text-blue-100">Strict CSP headers prevent XSS attacks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Permission-Based UI</h4>
                    <p className="text-sm text-blue-100">UI components render based on fine-grained permissions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Zero-Trust */}
            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Backend Security</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Zanzibar-Based Authorization</h4>
                    <p className="text-sm text-blue-100">Google-inspired relationship-based access control</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Request-Level Authentication</h4>
                    <p className="text-sm text-blue-100">Every API call authenticated with OAuth 2.0 tokens</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Encrypted Data at Rest</h4>
                    <p className="text-sm text-blue-100">AES-256-GCM with envelope encryption (AWS KMS, Vault)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Tamper-Evident Audit Logs</h4>
                    <p className="text-sm text-blue-100">Merkle tree verification for compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crypto Suite */}
          <div className="grid md:grid-cols-4 gap-4">
            {cryptoSuite.map((item, idx) => (
              <div
                key={`crypto-${idx}`}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="text-3xl font-bold mb-2">{item.name}</div>
                <div className="text-blue-100">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment & Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              From Clinic to Enterprise
            </h2>
            <p className="text-xl text-gray-600">
              Scalable architecture for any healthcare setting
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Edge Deployment */}
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
                  <Server className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Edge-Ready Deployment</h3>
                  <p className="text-gray-600">Built with Rust for minimal resource usage</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Raspberry Pi Compatible
                  </h4>
                  <p className="text-sm text-gray-600 ml-7">
                    Run full healthcare platform on Raspberry Pi 4/5 with just 2GB RAM. Perfect for remote clinics and mobile units.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    Low Power Consumption
                  </h4>
                  <p className="text-sm text-gray-600 ml-7">
                    Efficient Rust performance means lower electricity costs. Ideal for areas with limited power infrastructure.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    Offline-First Design
                  </h4>
                  <p className="text-sm text-gray-600 ml-7">
                    Works offline with automatic sync when connectivity returns. Critical for rural healthcare.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Healthcare Solutions</h3>
                  <p className="text-gray-600">End-to-end platform for any healthcare provider</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Small Clinics & Practices</h5>
                    <p className="text-sm text-gray-600">Patient management, appointments, billing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Diagnostic Laboratories</h5>
                    <p className="text-sm text-gray-600">Lab workflow, results management, integration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Hospitals & Medical Centers</h5>
                    <p className="text-sm text-gray-600">Full EHR, department coordination, inventory</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Medical Colleges & Training</h5>
                    <p className="text-sm text-gray-600">Academic integration, research, training modules</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Employee Health Management</h5>
                    <p className="text-sm text-gray-600">Corporate wellness, occupational health tracking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Pharmacy Networks</h5>
                    <p className="text-sm text-gray-600">Prescription management, inventory control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-lg text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">$50/mo</div>
              <div className="text-gray-600">Small Clinic Cost</div>
              <div className="text-xs text-gray-500 mt-1">Raspberry Pi hosting</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">5 min</div>
              <div className="text-gray-600">Setup Time</div>
              <div className="text-xs text-gray-500 mt-1">Docker one-command deploy</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
              <div className="text-xs text-gray-500 mt-1">Production-tested reliability</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Offline Operation</div>
              <div className="text-xs text-gray-500 mt-1">Works without internet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testing & Quality Assurance Section */}
      <section id="testing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Test Coverage
            </h2>
            <p className="text-xl text-gray-600">
              Production-ready with extensive test suites
            </p>
          </div>

          {/* Post-Quantum Cryptography Research Section */}
          <div className="mb-16 p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl border-2 border-amber-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Post-Quantum Cryptography</h3>
                <p className="text-amber-700 font-semibold">🔬 Active Research & Development</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-amber-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  Quantum-Resistant Algorithms
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>CRYSTALS-Kyber:</strong> NIST-approved key encapsulation mechanism for quantum-safe key exchange
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>CRYSTALS-Dilithium:</strong> Lattice-based digital signatures for quantum-resistant authentication
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>SPHINCS+:</strong> Hash-based signatures as backup quantum-safe option
                    </div>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-white rounded-xl border border-amber-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-600" />
                  Future-Proof Healthcare Security
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Hybrid Approach:</strong> Combining classical and post-quantum cryptography for transition period
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Long-term PHI Protection:</strong> Protecting medical records from future quantum computer attacks
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>NIST Compliance:</strong> Following NIST post-quantum cryptography standards (PQC)
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-300">
              <p className="text-center text-gray-900">
                <span className="font-bold text-amber-800">⚠️ Research Phase:</span> Post-quantum cryptography is under active research and development. 
                We're preparing the platform for the quantum computing era to ensure long-term security of healthcare data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold mb-6">
              ⚖️ Why RustCare?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for the Modern Healthcare Era
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              RustCare represents next-generation healthcare technology with performance, security, and efficiency that traditional systems can't match.
            </p>
          </div>

          {/* Key Differentiators Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-6 mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">200x Faster</h3>
              <p className="text-gray-300 text-center mb-4">Sub-millisecond authentication vs. 50-200ms in traditional systems</p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Traditional:</span>
                  <span className="text-red-400">50-200ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>RustCare:</span>
                  <span className="text-green-400">&lt;1ms</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 mx-auto">
                <Server className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">40x Less RAM</h3>
              <p className="text-gray-300 text-center mb-4">Runs on Raspberry Pi with &lt;100 MB RAM</p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Traditional:</span>
                  <span className="text-red-400">1-4 GB RAM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>RustCare:</span>
                  <span className="text-green-400">&lt;100 MB</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">70% Fewer Vulnerabilities</h3>
              <p className="text-gray-300 text-center mb-4">Memory safety guaranteed by Rust's ownership system</p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>No buffer overflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span>No use-after-free</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-white font-semibold">Feature</th>
                    <th className="px-6 py-4 text-gray-400 font-semibold">Traditional Systems</th>
                    <th className="px-6 py-4 text-blue-300 font-semibold">🚀 RustCare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Core Technology</td>
                    <td className="px-6 py-4 text-gray-400">Java / Spring (JVM)</td>
                    <td className="px-6 py-4 text-gray-300">Rust + React (memory-safe)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Deployment</td>
                    <td className="px-6 py-4 text-gray-400">Heavy (1-2 GB RAM min)</td>
                    <td className="px-6 py-4 text-gray-300">Edge-ready (&lt;100 MB RAM)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Security</td>
                    <td className="px-6 py-4 text-gray-400">Basic RBAC</td>
                    <td className="px-6 py-4 text-gray-300">Zero-Trust + Zanzibar + PQC</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Compliance</td>
                    <td className="px-6 py-4 text-gray-400">HIPAA (basic), HL7 v2.x</td>
                    <td className="px-6 py-4 text-gray-300">HIPAA + FHIR R4+ + GDPR + WHO</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Architecture</td>
                    <td className="px-6 py-4 text-gray-400">Monolithic core</td>
                    <td className="px-6 py-4 text-gray-300">Microservices + WASM plugins</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Offline Support</td>
                    <td className="px-6 py-4 text-gray-400">Weak (requires server)</td>
                    <td className="px-6 py-4 text-gray-300">Offline-first with sync</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Extensibility</td>
                    <td className="px-6 py-4 text-gray-400">Language-specific</td>
                    <td className="px-6 py-4 text-gray-300">WASM SDK (any language)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">Testing Coverage</td>
                    <td className="px-6 py-4 text-gray-400">Moderate</td>
                    <td className="px-6 py-4 text-gray-300">1,000+ tests, 85%+ coverage</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">License</td>
                    <td className="px-6 py-4 text-gray-400">MPL 2.0 / AGPL 3.0</td>
                    <td className="px-6 py-4 text-gray-300">Apache 2.0 (business-friendly)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">5-Year TCO</td>
                    <td className="px-6 py-4 text-gray-400">$270k-$650k</td>
                    <td className="px-6 py-4 text-green-400 font-semibold">$65k-$190k (70% savings)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-World Impact */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-red-900/30 to-pink-900/30 backdrop-blur-lg rounded-2xl border border-red-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">❌ Traditional Systems</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Require dedicated IT infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>High operational costs (servers, maintenance)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Limited deployment in rural settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Complex upgrade procedures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Weak offline capabilities</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-lg rounded-2xl border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">✅ RustCare Advantages</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Deploy anywhere: Cloud, on-premises, edge devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Low operational costs with minimal hardware</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Rural healthcare ready with offline-first design</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>One-click upgrades via Docker/Kubernetes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Intelligent sync engine for distributed care</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Target Audience */}
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-lg rounded-2xl border border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Perfect For</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🏥</div>
                <div className="text-white font-semibold mb-1">Small Clinics</div>
                <div className="text-sm text-gray-400">Limited IT budgets</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌾</div>
                <div className="text-white font-semibold mb-1">Rural Healthcare</div>
                <div className="text-sm text-gray-400">Intermittent connectivity</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🚑</div>
                <div className="text-white font-semibold mb-1">Mobile Units</div>
                <div className="text-sm text-gray-400">Operating from vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🏢</div>
                <div className="text-white font-semibold mb-1">Enterprise</div>
                <div className="text-sm text-gray-400">Multi-site deployments</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <div className="text-white font-semibold mb-1">Health NGOs</div>
                <div className="text-sm text-gray-400">Low-resource settings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔬</div>
                <div className="text-white font-semibold mb-1">Research</div>
                <div className="text-sm text-gray-400">FHIR R4+ compatibility</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🏛️</div>
                <div className="text-white font-semibold mb-1">Governments</div>
                <div className="text-sm text-gray-400">WHO/ICD compliance</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">☁️</div>
                <div className="text-white font-semibold mb-1">SaaS Providers</div>
                <div className="text-sm text-gray-400">Healthcare platforms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Section */}
      <section id="testing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 mx-auto">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Unit Tests</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Comprehensive Rust unit tests across all crates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>React component testing with Vitest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Cryptographic function validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Permission system edge cases</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 mx-auto">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Integration Tests</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>End-to-end API workflow testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Database transaction validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Multi-service communication tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>KMS and secrets integration</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">E2E Tests</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Playwright browser automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>User authentication flows</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>WCAG accessibility audits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Cross-browser compatibility</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">1,000+</div>
                <div className="text-gray-600">Test Cases</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">85%+</div>
                <div className="text-gray-600">Code Coverage</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-gray-600">Critical Paths</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">CI/CD</div>
                <div className="text-gray-600">Automated Testing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Build the Future of Healthcare?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the open-source healthcare revolution. Start building today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com/open-hims"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Github className="h-5 w-5" />
              Explore on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">RustCare</span>
              </div>
              <p className="text-sm">
                Open-source healthcare platform built with Rust for security, performance, and compliance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#architecture" className="hover:text-white transition-colors">Architecture</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/open-hims" className="hover:text-white transition-colors">GitHub Organization</a></li>
                <li><a href="https://github.com/open-hims/rustcare-engine" className="hover:text-white transition-colors">Backend Repository</a></li>
                <li><a href="https://github.com/open-hims/rustcare-ui" className="hover:text-white transition-colors">Frontend Repository</a></li>
                <li><a href="https://github.com/open-hims/.github/blob/main/COMPARISON.md" className="hover:text-white transition-colors">Feature Comparison</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/open-hims/rustcare-engine/discussions" className="hover:text-white transition-colors">Discussions</a></li>
                <li><a href="https://github.com/open-hims/rustcare-engine/issues" className="hover:text-white transition-colors">Issues</a></li>
                <li><a href="mailto:support@pages.openhims.health" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2025 OpenHIMS. Open Source under MIT/Apache-2.0 License. Built with ❤️ and 🦀 Rust.</p>
            <p className="mt-2 text-gray-500">
              <a href="https://pages.openhims.health" className="hover:text-white transition-colors">pages.openhims.health</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
          opacity: 0;
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        .typing-animation {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing 2s steps(30) forwards;
        }
      `}</style>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Military-grade encryption and zero-trust architecture",
    points: [
      "AES-256-GCM encryption",
      "OAuth 2.0 & JWT tokens",
      "Fine-grained authorization",
      "AWS KMS & Vault integration",
    ],
  },
  {
    icon: Activity,
    title: "HIPAA Compliance",
    description: "Built-in compliance for healthcare data",
    points: [
      "Comprehensive audit trails",
      "PHI/PII data classification",
      "Tamper-evident logging",
      "GDPR/CCPA ready",
    ],
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Sub-millisecond latency, 10,000+ req/sec",
    points: [
      "Zero-copy optimizations",
      "Connection pooling",
      "Horizontal scaling",
      "Memory efficient",
    ],
  },
  {
    icon: Workflow,
    title: "Workflow Engine",
    description: "Orchestrate complex healthcare processes",
    points: [
      "State machine execution",
      "Saga pattern support",
      "Scheduled tasks",
      "Human-in-the-loop",
    ],
  },
  {
    icon: Database,
    title: "Multi-Provider Secrets",
    description: "Centralized secrets management",
    points: [
      "HashiCorp Vault",
      "AWS Secrets Manager",
      "Azure Key Vault",
      "Kubernetes Secrets",
    ],
  },
  {
    icon: Bell,
    title: "Real-time Events",
    description: "Event-driven architecture",
    points: [
      "Kafka & RabbitMQ",
      "WebSocket support",
      "Event sourcing",
      "Dead letter queues",
    ],
  },
];

const architectureLayers = [
  {
    icon: Lock,
    title: "Security Layer",
    color: "bg-gradient-to-br from-red-500 to-pink-600",
    modules: [
      "auth-identity",
      "auth-oauth",
      "auth-zanzibar",
      "secrets-service",
      "crypto",
    ],
  },
  {
    icon: Server,
    title: "Core Engine",
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    modules: [
      "workflow-engine",
      "events-bus",
      "config-engine",
      "audit-engine",
    ],
  },
  {
    icon: Cloud,
    title: "Data Layer",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    modules: [
      "object-governance",
      "database-layer",
      "device-manager",
      "rustcare-sync",
    ],
  },
  {
    icon: Activity,
    title: "Operations",
    color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    modules: [
      "telemetry",
      "ops-cli",
      "plugin-runtime",
      "email-service",
    ],
  },
];

const securityFeatures = [
  {
    title: "Memory Safety",
    description: "Rust prevents 70% of security vulnerabilities through ownership system",
  },
  {
    title: "Zero-Trust Architecture",
    description: "Every request authenticated and authorized with fine-grained permissions",
  },
  {
    title: "Encryption at Rest",
    description: "Envelope encryption with AWS KMS and Vault integration",
  },
  {
    title: "Audit Logging",
    description: "Tamper-evident Merkle tree logs for compliance",
  },
];

const cryptoSuite = [
  { name: "AES-256", description: "Symmetric encryption" },
  { name: "RSA-4096", description: "Asymmetric keys" },
  { name: "Ed25519", description: "Digital signatures" },
  { name: "Argon2", description: "Password hashing" },
];
