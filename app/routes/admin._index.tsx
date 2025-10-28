import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import {
  Building2,
  Users,
  Shield,
  MapPin,
  FileText,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - RustCare Admin" },
    { name: "description", content: "RustCare Healthcare Management System - Administrative Dashboard Overview" },
  ];
};

// Loader: Fetch dashboard stats
export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Fetch real data from APIs
  const stats = {
    organizations: {
      total: 24,
      active: 22,
      hospitals: 8,
      clinics: 12,
      labs: 2,
      pharmacies: 2,
    },
    employees: {
      total: 156,
      active: 148,
      physicians: 45,
      nurses: 67,
      admin: 28,
      support: 16,
    },
    compliance: {
      frameworks: 8,
      rules: 342,
      compliant: 95,
      pending: 5,
    },
    recent: {
      activity: "2 new organizations added today",
      alerts: "3 compliance rules require attention",
    },
  };

  return json({ stats });
}

export default function AdminDashboard() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8 p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
          <h1 className="text-4xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-2 text-base">
            Manage your healthcare organization's compliance and permissions
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-blue-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Total Organizations
              </CardTitle>
              <Building2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.organizations.total}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                <span className="text-emerald-600 font-semibold">
                  {stats.organizations.active} active
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-blue-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Total Employees
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.employees.total}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                <span className="text-green-600 font-semibold">
                  {stats.employees.active} active
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-green-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Compliance Rate
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.compliance.compliant}%
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {stats.compliance.frameworks} frameworks monitored
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 hover:border-orange-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Pending Reviews
              </CardTitle>
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {stats.compliance.pending}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Menu - Main Actions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-5">
            Quick Access
          </h2>
          <NavigationMenu className="mx-0">
            <NavigationMenuList className="flex-wrap gap-3">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin/organizations" className={navigationMenuTriggerStyle()}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Organizations
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin/employees" className={navigationMenuTriggerStyle()}>
                    <Users className="mr-2 h-4 w-4" />
                    Employees
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin/roles" className={navigationMenuTriggerStyle()}>
                    <Shield className="mr-2 h-4 w-4" />
                    Roles & Permissions
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin/compliance" className={navigationMenuTriggerStyle()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Compliance
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin/geographic" className={navigationMenuTriggerStyle()}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Geographic
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Organizations Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-blue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Organizations
                </CardTitle>
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Manage hospitals, clinics, laboratories, and pharmacies across your healthcare network.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Hospitals</span>
                  <span className="font-semibold text-slate-900">
                    {stats.organizations.hospitals}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Clinics</span>
                  <span className="font-semibold text-slate-900">
                    {stats.organizations.clinics}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Labs</span>
                  <span className="font-semibold text-slate-900">
                    {stats.organizations.labs}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Pharmacies</span>
                  <span className="font-semibold text-slate-900">
                    {stats.organizations.pharmacies}
                  </span>
                </div>
              </div>
              <Link to="/admin/organizations" className={cn(buttonVariants(), "w-full")}>
                View All Organizations
              </Link>
            </CardContent>
          </Card>

          {/* Employees Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-blue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Employees
                </CardTitle>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Manage staff members, assign roles, and control access permissions across the system.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Physicians</span>
                  <span className="font-semibold text-slate-900">
                    {stats.employees.physicians}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Nurses</span>
                  <span className="font-semibold text-slate-900">
                    {stats.employees.nurses}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Admin Staff</span>
                  <span className="font-semibold text-slate-900">
                    {stats.employees.admin}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Support</span>
                  <span className="font-semibold text-slate-900">
                    {stats.employees.support}
                  </span>
                </div>
              </div>
              <Link to="/admin/employees" className={cn(buttonVariants(), "w-full")}>
                Manage Employees
              </Link>
            </CardContent>
          </Card>

          {/* Compliance Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-blue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Compliance
                </CardTitle>
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Monitor compliance frameworks, rules, and ensure regulatory adherence across all facilities.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Frameworks</span>
                  <span className="font-semibold text-slate-900">
                    {stats.compliance.frameworks}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Rules</span>
                  <span className="font-semibold text-slate-900">
                    {stats.compliance.rules}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Compliance Rate</span>
                  <span className="font-semibold text-green-600">
                    {stats.compliance.compliant}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Pending</span>
                  <span className="font-semibold text-orange-600">
                    {stats.compliance.pending}
                  </span>
                </div>
              </div>
              <Link to="/admin/compliance" className={cn(buttonVariants(), "w-full")}>
                View Compliance
              </Link>
            </CardContent>
          </Card>

          {/* Roles & Permissions Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-blue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Roles & Permissions
                </CardTitle>
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Define roles, set permissions, and manage access control using Zanzibar-based authorization.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Fine-grained access control</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Role-based permissions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Audit trail included</span>
                </div>
              </div>
              <Link to="/admin/roles" className={cn(buttonVariants(), "w-full")}>
                Manage Roles
              </Link>
            </CardContent>
          </Card>

          {/* Geographic Locations Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-blue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Geographic Locations
                </CardTitle>
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Manage geographic regions and automatically assign compliance frameworks based on location.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Regional compliance mapping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Postal code support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Auto-assignment rules</span>
                </div>
              </div>
              <Link to="/admin/geographic" className={cn(buttonVariants(), "w-full")}>
                Manage Locations
              </Link>
            </CardContent>
          </Card>

          {/* Reports Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-blue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Reports & Analytics
                </CardTitle>
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Generate compliance reports, audit logs, and analytics for your healthcare organization.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span>Real-time dashboards</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Compliance reports</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Audit trail history</span>
                </div>
              </div>
              <Link to="/admin/reports" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                View Reports
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {stats.recent.activity}
                </p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {stats.recent.alerts}
                </p>
                <p className="text-xs text-slate-500">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
