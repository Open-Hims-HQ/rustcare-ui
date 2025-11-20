import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { Shield, Mail, Lock, ArrowRight, Github, Building2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { authApi } from "~/lib/api/auth";
import { useAuthStore } from "~/stores/useAuthStore";

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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await authApi.login({ email, password });

      // Update store state
      useAuthStore.getState().login(response.user, response.token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link to="/landing" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
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
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-fade-in-up animation-delay-300">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-fade-in">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Demo Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 text-center font-semibold">
              🎭 Demo Mode - Use any credentials to explore
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                  placeholder="admin@openhims.health"
                  defaultValue="admin@openhims.health"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
                  required
                  placeholder="••••••••"
                  defaultValue="demo123"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
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
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Request Access
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 animate-fade-in-up animation-delay-300">
          <p className="text-xs text-gray-600 text-center mb-2 font-semibold">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 mb-1">Admin</p>
              <code className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">admin@openhims.health</code>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 mb-1">Password</p>
              <code className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">demo123</code>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2 animate-fade-in">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <a href="https://pages.openhims.health" className="hover:text-gray-900 transition-colors">About</a>
            <span>•</span>
            <a href="https://github.com/Open-Hims-HQ" className="hover:text-gray-900 transition-colors">GitHub</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
          </div>
          <p className="text-xs text-gray-500">
            © 2025 OpenHIMS. Open Source Healthcare Platform.
          </p>
        </div>
      </div>
    </div>
  );
}
