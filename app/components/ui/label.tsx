import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "~/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      // Material Design 3 - Body medium
      "text-sm font-medium leading-5 tracking-[0.25px]",
      "text-on-surface",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-38",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
