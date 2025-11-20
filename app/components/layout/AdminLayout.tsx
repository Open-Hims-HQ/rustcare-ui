import React, { useEffect } from "react"
import { Link, useLocation, useNavigate } from "@remix-run/react"
import {
  Home,
  Building2,
  Users,
  Shield,
  FileText,
  Settings,
  HelpCircle,
  Download,
  MapPin,
  UserPlus,
  Plus,
  ListFilter,
  Scale,
  Map,
  Keyboard,
  Activity,
  Heart,
  Pill,
  Package,
  Stethoscope,
  User,
  ChevronDown,
  Accessibility,
  LogOut,
  Bell,
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/components/ui/menubar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useAnnouncer } from "~/hooks/useAnnouncer"
import { LanguageSwitcher } from "~/components/LanguageSwitcher"
import { KeyboardShortcuts } from "~/components/KeyboardShortcuts"
import { useAccessibility } from "~/lib/accessibility"
import { useAuthStore } from "~/stores/useAuthStore"
import { authApi } from "~/lib/api/auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { Announcer } = useAnnouncer()
  const [currentLanguage, setCurrentLanguage] = React.useState("en")
  const accessibility = useAccessibility()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout failed", error)
    }
    logout()
    navigate("/login")
  }

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    // TODO: Integrate with i18n library
    console.log("Language changed to:", language)
  }

  const toggleAccessibility = () => {
    const newValue = !accessibility.preferences.audioEnabled && !accessibility.preferences.brailleEnabled
    accessibility.updatePreferences({
      audioEnabled: newValue,
      brailleEnabled: newValue
    })
  }

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ARIA live regions for screen reader announcements */}
      <Announcer />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Top Navigation Menubar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link
              to="/admin"
              className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              <Shield className="h-6 w-6 text-blue-600" />
              <span>RustCare Admin</span>
            </Link>

            {/* Navigation Menubar */}
            <Menubar className="border-slate-200">
              {/* File Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <FileText className="mr-2 h-4 w-4" />
                  File
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                      <MenubarShortcut>⌘D</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/onboarding">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Hospital Onboarding
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                    <MenubarShortcut>⌘E</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                      <MenubarShortcut>⌘,</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Organizations Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Building2 className="mr-2 h-4 w-4" />
                  Organizations
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/organizations">
                      <ListFilter className="mr-2 h-4 w-4" />
                      View All
                      <MenubarShortcut>⌘O</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Organization
                    <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Hospital</MenubarItem>
                  <MenubarItem>Clinic</MenubarItem>
                  <MenubarItem>Laboratory</MenubarItem>
                  <MenubarItem>Pharmacy</MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Employees Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Users className="mr-2 h-4 w-4" />
                  Employees
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/employees">
                      <ListFilter className="mr-2 h-4 w-4" />
                      View All Employees
                      <MenubarShortcut>⌘U</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Employee
                    <MenubarShortcut>⇧⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/roles">
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Roles
                      <MenubarShortcut>⌘R</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Permissions & Access Control Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Permissions
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/permissions">
                      <Shield className="mr-2 h-4 w-4" />
                      Manage Permissions
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/permissions/roles">
                      <Users className="mr-2 h-4 w-4" />
                      Zanzibar Roles
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/permissions/api">
                      <FileText className="mr-2 h-4 w-4" />
                      API Permissions
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/permissions/pages">
                      <Settings className="mr-2 h-4 w-4" />
                      Page Permissions
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Compliance Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Scale className="mr-2 h-4 w-4" />
                  Compliance
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/compliance">
                      <Scale className="mr-2 h-4 w-4" />
                      Frameworks & Rules
                      <MenubarShortcut>⌘C</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/geographic">
                      <Map className="mr-2 h-4 w-4" />
                      Geographic Locations
                      <MenubarShortcut>⌘G</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Healthcare Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Heart className="mr-2 h-4 w-4" />
                  Healthcare
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/healthcare/service-types">
                      <Settings className="mr-2 h-4 w-4" />
                      Service Types
                      <MenubarShortcut>⌘S</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/healthcare/providers">
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Providers
                      <MenubarShortcut>⌘P</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/emr">
                      <Activity className="mr-2 h-4 w-4" />
                      EMR Records
                      <MenubarShortcut>⌘M</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Pharmacy Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Pill className="mr-2 h-4 w-4" />
                  Pharmacy
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/pharmacy">
                      <ListFilter className="mr-2 h-4 w-4" />
                      Manage Pharmacy
                      <MenubarShortcut>⌘⇧P</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/pharmacy#inventory">
                      <Package className="mr-2 h-4 w-4" />
                      Inventory
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/pharmacy#prescriptions">
                      <FileText className="mr-2 h-4 w-4" />
                      Prescriptions
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Vendors Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Package className="mr-2 h-4 w-4" />
                  Vendors
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/vendors">
                      <ListFilter className="mr-2 h-4 w-4" />
                      Manage Vendors
                      <MenubarShortcut>⌘⇧V</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/vendors#types">
                      <Settings className="mr-2 h-4 w-4" />
                      Vendor Types
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/vendors#services">
                      <Package className="mr-2 h-4 w-4" />
                      Services Catalog
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Insurance Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Shield className="mr-2 h-4 w-4" />
                  Insurance
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/insurance">
                      <Shield className="mr-2 h-4 w-4" />
                      Providers
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/insurance/plans">
                      <FileText className="mr-2 h-4 w-4" />
                      Plans
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/insurance/claim-rules">
                      <Settings className="mr-2 h-4 w-4" />
                      Claim Rules
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/insurance/eligibility">
                      <Activity className="mr-2 h-4 w-4" />
                      Eligibility Check
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/insurance/authorizations">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Prior Authorizations
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Finance Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Finance
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/finance/billing">
                      <Receipt className="mr-2 h-4 w-4" />
                      Billing
                      <MenubarShortcut>⌘B</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/finance/claims">
                      <FileText className="mr-2 h-4 w-4" />
                      Claims
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/finance/payments">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payments
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem asChild>
                    <Link to="/admin/finance/accounting">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Accounting
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/finance/accounting/receivables">
                      <ListFilter className="mr-2 h-4 w-4" />
                      Accounts Receivable
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/admin/finance/accounting/reports">
                      <FileText className="mr-2 h-4 w-4" />
                      Financial Reports
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* Notifications Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/admin/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      All Notifications
                      <MenubarShortcut>⌘N</MenubarShortcut>
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* More Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  More
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                    <MenubarShortcut>⌘?</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <Keyboard className="mr-2 h-4 w-4" />
                    Keyboard Shortcuts
                    <MenubarShortcut>⇧⌘/</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Support
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>About RustCare</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Keyboard Shortcuts Button & Language Switcher & User Profile */}
            <div className="flex items-center space-x-2">
              <LanguageSwitcher
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                variant="ghost"
                showLabel={false}
              />

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-800 transition-all cursor-pointer">
                    {user?.name?.substring(0, 2).toUpperCase() || "AD"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@rustcare.com"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={toggleAccessibility} className="cursor-pointer">
                    <Accessibility className="mr-2 h-4 w-4" />
                    <span>Accessibility</span>
                    <span className="ml-auto">
                      {accessibility.preferences.audioEnabled && accessibility.preferences.brailleEnabled ? 'On' : 'Off'}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>&copy; 2025 RustCare. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                HIPAA Compliance
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
