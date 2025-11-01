import { useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TrendingUp, DollarSign, Receipt, AlertTriangle, Plus, Download } from "lucide-react";

export const meta = () => {
  return [
    { title: "Accounting Dashboard | RustCare Admin" },
    { name: "description", content: "Financial accounting and general ledger" },
  ];
};

export const loader = async () => {
  const summary = {
    totalRevenue: 125000.00,
    totalExpenses: 95000.00,
    netIncome: 30000.00,
    accountsReceivable: 25000.00,
    cashOnHand: 450000.00,
    thisMonth: {
      revenue: 15000.00,
      expenses: 12000.00,
      netIncome: 3000.00,
    },
  };

  const journalEntries = [
    {
      id: "1",
      entryNumber: "JE-2024-001",
      entryDate: "2024-01-15T00:00:00Z",
      description: "Monthly revenue recognition",
      totalDebits: 15000.00,
      totalCredits: 15000.00,
      isBalanced: true,
      status: "posted",
    },
    {
      id: "2",
      entryNumber: "JE-2024-002",
      entryDate: "2024-01-14T00:00:00Z",
      description: "Provider compensation",
      totalDebits: 8500.00,
      totalCredits: 8500.00,
      isBalanced: true,
      status: "posted",
    },
    {
      id: "3",
      entryNumber: "JE-2024-003",
      entryDate: "2024-01-13T00:00:00Z",
      description: "Equipment depreciation",
      totalDebits: 2000.00,
      totalCredits: 2000.00,
      isBalanced: true,
      status: "draft",
    },
  ];

  const chartOfAccounts = [
    { code: "1000", name: "Cash", type: "Asset", balance: 450000.00 },
    { code: "1200", name: "Accounts Receivable", type: "Asset", balance: 25000.00 },
    { code: "1500", name: "Equipment", type: "Asset", balance: 125000.00 },
    { code: "2000", name: "Accounts Payable", type: "Liability", balance: 18000.00 },
    { code: "3000", name: "Equity", type: "Equity", balance: 582000.00 },
    { code: "4000", name: "Service Revenue", type: "Revenue", balance: 125000.00 },
    { code: "5000", name: "Salary Expense", type: "Expense", balance: 75000.00 },
    { code: "5100", name: "Rent Expense", type: "Expense", balance: 15000.00 },
    { code: "5200", name: "Depreciation Expense", type: "Expense", balance: 5000.00 },
  ];

  return { summary, journalEntries, chartOfAccounts };
};

export default function AccountingDashboard() {
  const { summary, journalEntries, chartOfAccounts } = useLoaderData<typeof loader>();

  const getAccountTypeColor = (type: string) => {
    const colors = {
      Asset: "text-blue-600",
      Liability: "text-red-600",
      Equity: "text-green-600",
      Revenue: "text-purple-600",
      Expense: "text-orange-600",
    };
    return colors[type as keyof typeof colors] || "text-gray-600";
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "posted" ? "default" : "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6" id="accounting-dashboard-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" id="accounting-page-title">Accounting Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Financial accounting and general ledger management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Journal Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${summary.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +${summary.thisMonth.revenue.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${summary.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              -${summary.thisMonth.expenses.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary.netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((summary.netIncome / summary.totalRevenue) * 100).toFixed(1)}% margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash on Hand</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summary.cashOnHand.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Operating cash available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accounts Receivable</CardTitle>
            <CardDescription>Current outstanding receivables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-600">
                  ${summary.accountsReceivable.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Requires collection action
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month Summary</CardTitle>
            <CardDescription>Revenue vs expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="text-sm font-medium text-green-600">
                  ${summary.thisMonth.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <span className="text-sm font-medium text-red-600">
                  -${summary.thisMonth.expenses.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-sm font-medium">Net</span>
                <span className="text-sm font-bold">
                  ${summary.thisMonth.netIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="journal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
              <CardDescription>Recent accounting entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Debits</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Balanced</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.entryNumber}</TableCell>
                      <TableCell>
                        {new Date(entry.entryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>${entry.totalDebits.toFixed(2)}</TableCell>
                      <TableCell>${entry.totalCredits.toFixed(2)}</TableCell>
                      <TableCell>
                        {entry.isBalanced ? (
                          <Badge variant="default">Yes</Badge>
                        ) : (
                          <Badge variant="destructive">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>Account structure and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartOfAccounts.map((account, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <span className={getAccountTypeColor(account.type)}>
                          {account.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${account.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate financial statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="flex flex-col h-auto py-6">
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <span className="font-medium">Income Statement</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Revenue and expenses
                  </span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-6">
                  <DollarSign className="h-8 w-8 mb-2" />
                  <span className="font-medium">Balance Sheet</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Assets and liabilities
                  </span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-6">
                  <Receipt className="h-8 w-8 mb-2" />
                  <span className="font-medium">Cash Flow</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Operating activities
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
