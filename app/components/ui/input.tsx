import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "~/lib/utils";
import { useOptionalPermission } from "~/hooks/usePermissions";
import type { PermissionCheck } from "~/lib/permissions";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Show info icon for contextual help (content to be added later) */
  showInfoIcon?: boolean;
  /** ID for the info icon tooltip/popover (to be implemented) */
  infoId?: string;
  /** Aria-describedby for linking input to help text */
  "aria-describedby"?: string;
  /** Permission check for this input */
  permission?: PermissionCheck;
  /** If true, hide input when permission is denied. If false, make it readonly/disabled */
  hideIfDenied?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showInfoIcon, infoId, permission, hideIfDenied = false, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    const inputId = props.id || `input-${React.useId()}`;
    const hasPermission = useOptionalPermission(permission);
    const helpTextId = infoId || `${inputId}-help`;
    const describedBy = ariaDescribedBy || (showInfoIcon ? helpTextId : undefined);

    // If permission is denied and hideIfDenied is true, don't render
    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2",
            "text-sm text-neutral-900 placeholder:text-neutral-400",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
            "aria-[invalid=true]:border-danger-500 aria-[invalid=true]:ring-danger-500",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            showInfoIcon && "pr-10", // Add padding for info icon
            permission && !hasPermission && "opacity-70",
            className
          )}
          ref={ref}
          id={inputId}
          aria-describedby={describedBy}
          readOnly={permission ? !hasPermission || props.readOnly : props.readOnly}
          disabled={permission ? !hasPermission || props.disabled : props.disabled}
          {...props}
        />
        {showInfoIcon && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Show help information"
            aria-controls={helpTextId}
            // TODO: Implement tooltip/popover for help text
            onClick={() => console.log("Info icon clicked - implement tooltip")}
          >
            <Info className="h-4 w-4" />
          </button>
        )}
        {/* Hidden element for screen readers - content to be added later */}
        {showInfoIcon && (
          <span id={helpTextId} className="sr-only">
            {/* TODO: Add contextual help text here */}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
