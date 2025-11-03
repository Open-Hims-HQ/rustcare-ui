import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { useOptionalPermission } from "~/hooks/usePermissions";
import type { PermissionCheck } from "~/lib/permissions";
import { useMcp, type McpButtonConfig } from "~/decorators/mcp-component";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md active:bg-primary-800 active:scale-[0.98] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md active:bg-neutral-100 active:scale-[0.98] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 hover:shadow-md active:bg-primary-100 active:scale-[0.98] hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "text-neutral-700 hover:bg-neutral-100 hover:shadow-sm active:bg-neutral-200 active:scale-[0.98]",
        destructive:
          "bg-danger-600 text-white hover:bg-danger-700 hover:shadow-md active:bg-danger-800 active:scale-[0.98] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        success:
          "bg-success-600 text-white hover:bg-success-700 hover:shadow-md active:bg-success-800 active:scale-[0.98] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        warning:
          "bg-warning-500 text-white hover:bg-warning-600 hover:shadow-md active:bg-warning-700 active:scale-[0.98] shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        link:
          "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 active:text-primary-800",
      },
      size: {
        sm: "h-9 px-3 text-sm min-w-[4rem] rounded-md gap-1.5",
        default: "h-10 px-5 text-sm min-w-[5rem] gap-2",
        lg: "h-12 px-6 text-base min-w-[6rem] gap-2.5",
        xl: "h-14 px-8 text-lg min-w-[7rem] gap-3",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
        "icon-lg": "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
  disabledMessage?: string;
  /** MCP configuration for auto-registration */
  mcp?: McpButtonConfig;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, permission, hideIfDenied = false, disabledMessage, asChild, mcp, ...props }, ref) => {
    const hasPermission = useOptionalPermission(permission);
    
    // Auto-register MCP config if provided
    useMcp(mcp);

    // If permission is denied and hideIfDenied is true, don't render
    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    // Extract asChild from props to prevent it from being passed to DOM element
    // Note: asChild prop is kept in interface for compatibility but not used in this implementation
    // If you need Slot/asChild functionality, integrate @radix-ui/react-slot

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={permission ? !hasPermission || props.disabled : props.disabled}
        title={permission && !hasPermission && disabledMessage ? disabledMessage : props.title}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
