import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-38",
  {
    variants: {
      variant: {
        // Filled buttons - M3 elevated style with proper shadows
        default: "text-white rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)] active:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)]",
        secondary: "text-white rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)]",
        accent: "text-white rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)]",
        warning: "text-white rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)]",
        destructive: "text-white rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)]",
        success: "text-white rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_3px_rgba(0,0,0,0.15)]",
        // Outlined buttons - M3 style
        outline: "border rounded-[20px] bg-transparent hover:bg-[rgba(0,0,0,0.08)] active:bg-[rgba(0,0,0,0.12)]",
        // Text buttons - M3 style (no border, just state layer)
        ghost: "rounded-[20px] hover:bg-[rgba(0,0,0,0.08)] active:bg-[rgba(0,0,0,0.12)]",
        // Links
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // M3 standard heights - 4dp increments
        sm: "h-[32px] px-[12px] text-[14px] rounded-[16px]",      // Compact density
        default: "h-[40px] px-[24px] text-[14px]",                // Default density
        lg: "h-[48px] px-[32px] text-[16px] rounded-[24px]",      // Comfortable density
        xl: "h-[56px] px-[40px] text-[16px] rounded-[28px]",      // Large
        icon: "h-[40px] w-[40px] p-0",                             // Icon button (square)
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
