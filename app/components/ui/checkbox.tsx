import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Material Design 3 - Checkbox (18x18dp)
      "peer h-[18px] w-[18px] shrink-0 rounded-[2px]",
      "border-2 border-on-surface-variant bg-transparent",
      "transition-all duration-200 ease-out",
      // Focus state - 40x40dp touch target
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      // Hover state
      "hover:border-on-surface hover:bg-on-surface/8",
      // Checked state
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-on-primary",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-38 disabled:border-on-surface/38",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5"
      >
        <path
          d="M14.25 4.8075L6.75 12.3075L3 8.5575L4.0575 7.5L6.75 10.1925L13.1925 3.75L14.25 4.8075Z"
          fill="currentColor"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
