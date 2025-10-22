import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Violet (Main actions)
        default: "text-white shadow-lg hover:scale-105",
        // Secondary - Teal (Supporting actions)
        secondary: "text-white shadow-lg hover:scale-105",
        // Accent - Cyan (Tertiary actions)
        accent: "text-white shadow-lg hover:scale-105",
        // Warning - Orange (Alerts)
        warning: "text-white shadow-lg hover:scale-105",
        // Destructive - Magenta (Danger)
        destructive: "text-white shadow-lg hover:scale-105",
        // Success - Aqua (Positive actions)
        success: "shadow-lg hover:scale-105",
        // Outline - Transparent with border
        outline: "border-2 bg-transparent backdrop-blur-sm hover:scale-105",
        // Ghost - Subtle hover
        ghost: "hover:backdrop-blur-sm hover:bg-white/10",
        // Link - Text only
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
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
