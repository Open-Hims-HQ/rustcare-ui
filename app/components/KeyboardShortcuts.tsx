import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Keyboard } from "lucide-react"

interface ShortcutGroup {
  category: string
  shortcuts: {
    keys: string[]
    description: string
    context?: string
  }[]
}

const KEYBOARD_SHORTCUTS: ShortcutGroup[] = [
  {
    category: "Navigation",
    shortcuts: [
      {
        keys: ["⌘", "D"],
        description: "Go to Dashboard",
        context: "From anywhere in the app"
      },
      {
        keys: ["⌘", "O"],
        description: "View All Organizations",
        context: "Opens organizations page"
      },
      {
        keys: ["⌘", "U"],
        description: "View All Employees",
        context: "Opens employees page"
      },
      {
        keys: ["⌘", "R"],
        description: "Manage Roles",
        context: "Opens roles & permissions page"
      },
      {
        keys: ["⌘", "C"],
        description: "Compliance Frameworks",
        context: "Opens compliance management"
      },
      {
        keys: ["⌘", "G"],
        description: "Geographic Locations",
        context: "Opens geographic settings"
      },
      {
        keys: ["⌘", "?"],
        description: "Documentation",
        context: "Opens help documentation"
      },
      {
        keys: ["⌘", ","],
        description: "Settings",
        context: "Opens application settings"
      }
    ]
  },
  {
    category: "General Actions",
    shortcuts: [
      {
        keys: ["⌘", "N"],
        description: "New Item",
        context: "Creates new organization, role, etc. (context-dependent)"
      },
      {
        keys: ["⇧", "⌘", "N"],
        description: "Add Employee",
        context: "Opens add employee dialog"
      },
      {
        keys: ["⌘", "E"],
        description: "Export Data",
        context: "Exports current view data"
      },
      {
        keys: ["⌘", "S"],
        description: "Save",
        context: "Saves current form or changes"
      }
    ]
  },
  {
    category: "Keyboard Navigation",
    shortcuts: [
      {
        keys: ["Tab"],
        description: "Move to next element",
        context: "Navigate forward through interactive elements"
      },
      {
        keys: ["⇧", "Tab"],
        description: "Move to previous element",
        context: "Navigate backward through interactive elements"
      },
      {
        keys: ["↑", "↓"],
        description: "Navigate in menus",
        context: "Move up/down in dropdowns and menus"
      },
      {
        keys: ["←", "→"],
        description: "Navigate tabs/options",
        context: "Move between tabs or horizontal options"
      },
      {
        keys: ["Enter"],
        description: "Activate/Submit",
        context: "Click button or submit form"
      },
      {
        keys: ["Space"],
        description: "Toggle/Select",
        context: "Toggle checkboxes, open dropdowns"
      },
      {
        keys: ["Esc"],
        description: "Close/Cancel",
        context: "Close dialogs, menus, or cancel actions"
      }
    ]
  },
  {
    category: "Accessibility",
    shortcuts: [
      {
        keys: ["Tab"],
        description: "Skip to main content",
        context: "Press Tab on page load to reveal skip link"
      },
      {
        keys: ["⌘", "F"],
        description: "Search",
        context: "Focus search input (browser default)"
      },
      {
        keys: ["⌘", "+"],
        description: "Zoom in",
        context: "Increase text size (browser default)"
      },
      {
        keys: ["⌘", "-"],
        description: "Zoom out",
        context: "Decrease text size (browser default)"
      },
      {
        keys: ["⌘", "0"],
        description: "Reset zoom",
        context: "Reset to 100% zoom (browser default)"
      }
    ]
  }
]

interface KeyboardShortcutsProps {
  /** Trigger button variant */
  variant?: "default" | "outline" | "ghost"
  /** Show as icon button only */
  iconOnly?: boolean
}

export function KeyboardShortcuts({ variant = "ghost", iconOnly = false }: KeyboardShortcutsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={iconOnly ? "icon" : "default"}
          aria-label="View keyboard shortcuts"
        >
          <Keyboard className={iconOnly ? "h-5 w-5" : "mr-2 h-4 w-4"} />
          {!iconOnly && "Keyboard Shortcuts"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Keyboard className="h-6 w-6 text-blue-600" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and interact with the application efficiently
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {KEYBOARD_SHORTCUTS.map((group) => (
            <div key={group.category}>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3 pb-2 border-b border-neutral-200">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-4 py-2 hover:bg-neutral-50 rounded-lg px-2 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">
                        {shortcut.description}
                      </p>
                      {shortcut.context && (
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {shortcut.context}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd
                            className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 text-sm font-semibold text-neutral-700 bg-white border border-neutral-300 rounded shadow-sm"
                            aria-label={
                              key === "⌘" ? "Command" :
                              key === "⇧" ? "Shift" :
                              key === "↑" ? "Up arrow" :
                              key === "↓" ? "Down arrow" :
                              key === "←" ? "Left arrow" :
                              key === "→" ? "Right arrow" :
                              key
                            }
                          >
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-neutral-400 mx-0.5 text-sm">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
              <h4 className="font-semibold text-blue-900 text-sm mb-1">
                Platform Note
              </h4>
              <p className="text-xs text-blue-800">
                On Windows/Linux, replace <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold bg-white border border-blue-300 rounded">⌘</kbd> with <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold bg-white border border-blue-300 rounded">Ctrl</kbd>
              </p>
            </div>
          </div>
        </div>

        {/* Screen Reader Support Info */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex gap-3">
            <div className="text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 text-sm mb-1">
                Screen Reader Accessible
              </h4>
              <p className="text-xs text-green-800">
                All keyboard shortcuts work with screen readers. Focus indicators will be visible when navigating with keyboard.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default KeyboardShortcuts
