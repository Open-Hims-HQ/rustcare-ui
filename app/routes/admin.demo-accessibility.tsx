import { useState } from "react"
import type { MetaFunction } from "@remix-run/node"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { useAnnouncer } from "~/hooks/useAnnouncer"

export const meta: MetaFunction = () => {
  return [
    { title: "Accessibility Demo - RustCare Admin" },
    { name: "description", content: "Demonstration of WCAG AA compliant components and accessibility features" },
  ];
};

/**
 * Demonstration page showing WCAG AA compliant components with:
 * - Proper ARIA labels
 * - Info icons on inputs (with placeholders for future help text)
 * - Primary and secondary labels on cards
 * - Screen reader announcements
 */
export default function DemoAccessibility() {
  const { announce, announceSuccess } = useAnnouncer()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    announceSuccess("Form submitted successfully")
    console.log("Form data:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Announce to screen readers when significant fields are filled
    if (field === "name" && value.length > 0) {
      announce(`Name field updated: ${value}`, { priority: "polite" })
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Accessibility Demo
        </h1>
        <p className="text-neutral-600">
          This page demonstrates WCAG AA compliant components with proper labels,
          info icons, and screen reader support.
        </p>
      </div>

      {/* Demo: Card with Primary and Secondary Labels */}
      <section aria-labelledby="cards-heading">
        <h2 id="cards-heading" className="text-2xl font-semibold mb-4">
          Cards with Secondary Labels
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle secondary="Updated 2 mins ago">
                User Profile
              </CardTitle>
              <CardDescription secondary="Last login: Today at 9:45 AM">
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" aria-label="Edit user profile">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle
                secondary="3 pending"
                secondaryClassName="text-amber-600 font-medium"
              >
                Notifications
              </CardTitle>
              <CardDescription secondary="Last notification: 5 mins ago">
                View and manage your system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" aria-label="View all notifications">
                View All
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo: Form with Info Icons and Proper Labels */}
      <section aria-labelledby="form-heading">
        <h2 id="form-heading" className="text-2xl font-semibold mb-4">
          Form with Info Icons
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              All fields include info icons for contextual help (to be populated
              later)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field with info icon */}
              <div className="space-y-2">
                <Label htmlFor="demo-name" className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="demo-name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  showInfoIcon
                  infoId="name-help"
                  required
                  aria-label="Enter your full name"
                  aria-required="true"
                />
                <p id="name-help" className="text-xs text-neutral-500">
                  Enter your first and last name as it appears on official documents
                </p>
              </div>

              {/* Email field with info icon */}
              <div className="space-y-2">
                <Label htmlFor="demo-email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  showInfoIcon
                  infoId="email-help"
                  required
                  aria-label="Enter your email address"
                  aria-required="true"
                />
                <p id="email-help" className="text-xs text-neutral-500">
                  We'll use this email for account notifications and password resets
                </p>
              </div>

              {/* Phone field with info icon */}
              <div className="space-y-2">
                <Label htmlFor="demo-phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="demo-phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  showInfoIcon
                  infoId="phone-help"
                  aria-label="Enter your phone number (optional)"
                />
                <p id="phone-help" className="text-xs text-neutral-500">
                  Optional: For two-factor authentication and account recovery
                </p>
              </div>

              {/* Submit button with proper label */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  aria-label="Submit contact information form"
                >
                  Save Information
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Demo: Buttons with Descriptive Labels */}
      <section aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className="text-2xl font-semibold mb-4">
          Buttons with Descriptive Labels
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Action Buttons</CardTitle>
            <CardDescription>
              All buttons have descriptive aria-labels for screen readers
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="default"
              aria-label="Add new organization to the system"
              onClick={() => announceSuccess("Add organization dialog opened")}
            >
              Add Organization
            </Button>
            <Button
              variant="outline"
              aria-label="Export data to CSV file"
              onClick={() => announce("Export started", { priority: "polite" })}
            >
              Export Data
            </Button>
            <Button
              variant="ghost"
              aria-label="View detailed help documentation"
              onClick={() => announce("Opening help documentation")}
            >
              Help
            </Button>
            <Button
              variant="destructive"
              aria-label="Delete selected item - this action cannot be undone"
              onClick={() =>
                announce("Delete confirmation required", { priority: "assertive" })
              }
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                WCAG AA Compliant
              </h3>
              <p className="text-sm text-blue-800">
                This page demonstrates components that meet WCAG AA accessibility
                standards including proper labeling, keyboard navigation, focus
                indicators, and screen reader support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
