import * as React from "react";
import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Material Design 3 - Filled text field
          "flex h-14 w-full rounded-t-[4px] rounded-b-none",
          "border-b-2 border-outline bg-surface-variant",
          "px-4 pt-5 pb-2 text-base leading-tight",
          "text-on-surface placeholder:text-on-surface-variant",
          "transition-colors duration-200",
          // Focus state
          "focus-visible:outline-none focus-visible:border-primary focus-visible:bg-surface-variant",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-38 disabled:bg-surface-variant",
          // Error state
          "aria-[invalid=true]:border-error aria-[invalid=true]:text-error",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
