import { Link, useLocation } from "@remix-run/react"
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

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
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

              {/* Help Menu */}
              <MenubarMenu>
                <MenubarTrigger>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Documentation
                    <MenubarShortcut>⌘?</MenubarShortcut>
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

            {/* User Profile (placeholder) */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
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
