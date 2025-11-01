import { Link } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Receipt, FileText, CreditCard, Shield, Activity, TrendingUp, ListFilter, DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";

export const meta = () => {
  return [
    { title: "Finance | RustCare Admin" },
    { name: "description", content: "Financial management and revenue cycle" },
  ];
};

export default function FinanceIndex() {
  const menuItems = [
    {
      title: "Billing",
      description: "Charge capture and revenue management",
      icon: Receipt,
      link: "/admin/finance/billing",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      stats: {
        label: "This Month",
        value: "$125,000",
        trend: "+12%",
      },
    },
    {
      title: "Claims",
      description: "Insurance claims and submissions",
      icon: FileText,
      link: "/admin/finance/claims",
      color: "text-green-600",
      bgColor: "bg-green-50",
      stats: {
        label: "Pending",
        value: "5",
        trend: "Processing",
      },
    },
    {
      title: "Payments",
      description: "Payment processing and tracking",
      icon: CreditCard,
      link: "/admin/finance/payments",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      stats: {
        label: "Today",
        value: "$3,450",
        trend: "+8%",
      },
    },
    {
      title: "Insurance",
      description: "Insurance plans and eligibility",
      icon: Shield,
      link: "/admin/finance/insurance",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      stats: {
        label: "Active Plans",
        value: "15",
        trend: "Configured",
      },
    },
    {
      title: "Eligibility Check",
      description: "Verify patient insurance eligibility",
      icon: Activity,
      link: "/admin/finance/insurance/eligibility",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      stats: {
        label: "This Week",
        value: "42",
        trend: "Checks",
      },
    },
    {
      title: "Prior Authorizations",
      description: "Authorization requests and approvals",
      icon: CheckCircle2,
      link: "/admin/finance/insurance/authorizations",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      stats: {
        label: "Pending",
        value: "3",
        trend: "Awaiting",
      },
    },
    {
      title: "Accounting",
      description: "Financial accounting and ledger",
      icon: TrendingUp,
      link: "/admin/finance/accounting",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      stats: {
        label: "Net Income",
        value: "$30,000",
        trend: "+5%",
      },
    },
    {
      title: "Accounts Receivable",
      description: "AR aging and collections",
      icon: ListFilter,
      link: "/admin/finance/accounting/receivables",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      stats: {
        label: "Outstanding",
        value: "$25,000",
        trend: AlertTriangle,
      },
    },
    {
      title: "Financial Reports",
      description: "Generate financial statements",
      icon: DollarSign,
      link: "/admin/finance/accounting/reports",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      stats: {
        label: "Available",
        value: "5",
        trend: "Reports",
      },
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6" id="finance-overview-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" id="finance-page-title">Finance & Revenue</h1>
          <p className="text-muted-foreground mt-1">
            Manage billing, insurance, payments, and accounting
          </p>
        </div>

        {/* Finance Menu Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const TrendIcon = typeof item.stats.trend === "string" ? null : item.stats.trend;

            return (
              <Link key={item.title} to={item.link} className="group">
                <Card id={`finance-menu-${item.title.toLowerCase().replace(/\s+/g, '-')}`} className="h-full transition-all hover:shadow-md hover:border-primary cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      {TrendIcon && (
                        <TrendIcon className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <CardTitle className="mt-2">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {item.stats.label}
                        </p>
                        <p className="text-2xl font-bold">{item.stats.value}</p>
                      </div>
                      {typeof item.stats.trend === "string" && (
                        <p className="text-sm text-green-600 font-medium">
                          {item.stats.trend}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4" id="finance-quick-stats">
          <Card id="finance-stat-total-revenue">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$452,250</div>
              <p className="text-xs text-muted-foreground">
                All-time cumulative
              </p>
            </CardContent>
          </Card>

          <Card id="finance-stat-collections">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$389,000</div>
              <p className="text-xs text-muted-foreground">
                86% collection rate
              </p>
            </CardContent>
          </Card>

          <Card id="finance-stat-outstanding">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">$42,500</div>
              <p className="text-xs text-muted-foreground">
                Pending collection
              </p>
            </CardContent>
          </Card>

          <Card id="finance-stat-net-income">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">$30,000</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card id="finance-revenue-cycle-banner" className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Cycle Management</CardTitle>
            <CardDescription>
              Complete financial workflow from eligibility verification to payment collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Eligibility Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Charge Capture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Claims Submission</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Payment Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Financial Reporting</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
