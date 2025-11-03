import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Shield, Mail, Lock, ArrowRight, Github, Building2 } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - OpenHIMS" },
    {
      name: "description",
      content: "Sign in to OpenHIMS Healthcare Management Platform",
    },
  ];
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/landing" className="inline-flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              OpenHIMS
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your healthcare platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 text-center font-semibold">
              🎭 Demo Mode - Use any credentials to explore
            </p>
          </div>

          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@openhims.health"
                  defaultValue="admin@openhims.health"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  defaultValue="demo123"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* SSO Options */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
              <Github className="h-5 w-5" />
              Continue with GitHub
            </button>
            <button className="w-full py-3 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
              <Building2 className="h-5 w-5" />
              Enterprise SSO
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                Request Access
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-2 font-semibold">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Admin</p>
              <p className="font-mono text-gray-900">admin@openhims.health</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Password</p>
              <p className="font-mono text-gray-900">demo123</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <a href="https://pages.openhims.health" className="hover:text-gray-900">About</a>
            <span>•</span>
            <a href="https://github.com/Open-Hims-HQ-HQ" className="hover:text-gray-900">GitHub</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900">Privacy</a>
          </div>
          <p className="text-xs text-gray-500">
            © 2025 OpenHIMS. Open Source Healthcare Platform.
          </p>
        </div>
      </div>
    </div>
  );
}
