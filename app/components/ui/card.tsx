import * as React from "react";
import { cn } from "~/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { elevation?: 1 | 2 | 3 | 4 | 5 }
>(({ className, elevation = 1, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Material Design 3 - Elevated Card
      "rounded-xl bg-surface text-on-surface",
      "border border-outline-variant",
      "transition-shadow duration-200",
      // Elevation levels
      elevation === 1 && "shadow-md",
      elevation === 2 && "shadow-lg",
      elevation === 3 && "shadow-xl",
      elevation === 4 && "shadow-2xl",
      elevation === 5 && "shadow-3xl",
      // Hover state
      "hover:shadow-lg",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Material Design 3 - 16dp padding
      "flex flex-col gap-2 p-4",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Material Design 3 - Headline small
      "text-2xl font-normal leading-8 tracking-normal text-on-surface",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      // Material Design 3 - Body medium
      "text-sm font-normal leading-5 tracking-[0.25px] text-on-surface-variant",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      // Material Design 3 - 16dp padding
      "p-4 pt-0", 
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Material Design 3 - 16dp padding, 8dp gap
      "flex items-center gap-2 p-4 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
