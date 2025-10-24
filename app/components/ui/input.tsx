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
          "flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2",
          "text-sm text-neutral-900 placeholder:text-neutral-400",
          "transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
          "aria-[invalid=true]:border-danger-500 aria-[invalid=true]:ring-danger-500",
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
