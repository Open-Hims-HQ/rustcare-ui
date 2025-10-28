import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
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
  FileText,
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

export default function LandingPage() {
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
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">
                Security
              </a>
              <a
                href="https://docs.rustcare.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Docs
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
                  Open Source Healthcare Platform
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Enterprise Healthcare
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Built with Rust
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Security-first, HIPAA-compliant healthcare platform with
                sub-millisecond performance. Built for scale, designed for compliance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Building
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://github.com/open-hims/rustcare-engine"
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
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">HIPAA Ready</div>
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

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build secure, compliant healthcare applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
              href="https://docs.rustcare.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Read Documentation
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
                <li><a href="https://docs.rustcare.dev" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/open-hims/rustcare-engine" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://rustcare.dev/api" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://discord.gg/rustcare" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://twitter.com/rustcare" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="mailto:support@rustcare.dev" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2025 RustCare. Open Source under MIT/Apache-2.0 License. Built with ❤️ and 🦀 Rust.</p>
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
