import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { useOptionalPermission } from "~/hooks/usePermissions";
import type { PermissionCheck } from "~/lib/permissions";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-100 text-blue-700",
        secondary:
          "border-transparent bg-slate-100 text-slate-700",
        success:
          "border-transparent bg-emerald-100 text-emerald-700",
        warning:
          "border-transparent bg-amber-100 text-amber-700",
        destructive:
          "border-transparent bg-red-100 text-red-700",
        danger:
          "border-transparent bg-red-100 text-red-700",
        neutral:
          "border-transparent bg-slate-100 text-slate-700",
        outline: "text-slate-700 border-slate-300 bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

function Badge({ className, variant, permission, hideIfDenied = false, ...props }: BadgeProps) {
  const hasPermission = useOptionalPermission(permission);

  if (permission && !hasPermission && hideIfDenied) {
    return null;
  }

  return (
    <div 
      className={cn(
        badgeVariants({ variant }),
        permission && !hasPermission && "opacity-50",
        className
      )} 
      {...props} 
    />
  );
}

export { Badge, badgeVariants };
