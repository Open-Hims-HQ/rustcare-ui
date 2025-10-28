import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { useOptionalPermission } from "~/hooks/usePermissions";
import type { PermissionCheck } from "~/lib/permissions";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm",
        secondary:
          "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100",
        outline:
          "border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100",
        ghost:
          "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200",
        destructive:
          "bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 shadow-sm",
        success:
          "bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-sm",
        warning:
          "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-sm",
        link:
          "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, permission, hideIfDenied = false, disabledMessage, asChild, ...props }, ref) => {
    const hasPermission = useOptionalPermission(permission);

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
