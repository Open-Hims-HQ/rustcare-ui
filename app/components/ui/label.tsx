import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "~/lib/utils";
import { useOptionalPermission } from "~/hooks/usePermissions";
import type { PermissionCheck } from "~/lib/permissions";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, permission, hideIfDenied = false, ...props }, ref) => {
  const hasPermission = useOptionalPermission(permission);

  if (permission && !hasPermission && hideIfDenied) {
    return null;
  }

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        // Material Design 3 - Body medium
        "text-sm font-medium leading-5 tracking-[0.25px]",
        "text-on-surface",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-38",
        permission && !hasPermission && "opacity-50",
        className
      )}
      {...props}
    />
  );
})
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
