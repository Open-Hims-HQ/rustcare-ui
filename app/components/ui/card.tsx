import * as React from "react";
import { cn } from "~/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg bg-white border border-neutral-200 shadow-sm transition-all",
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
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Optional secondary label text displayed alongside the title */
  secondary?: string;
  /** Optional secondary label className for styling */
  secondaryClassName?: string;
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, secondary, secondaryClassName, children, ...props }, ref) => {
    const titleId = React.useId();

    return (
      <div className="flex items-baseline justify-between gap-2">
        <h3
          ref={ref}
          id={titleId}
          className={cn(
            "text-xl font-semibold leading-none tracking-tight text-neutral-900",
            className
          )}
          {...props}
        >
          {children}
        </h3>
        {secondary && (
          <span
            className={cn(
              "text-sm font-normal text-neutral-500",
              secondaryClassName
            )}
            aria-label={`Secondary information: ${secondary}`}
          >
            {secondary}
          </span>
        )}
      </div>
    );
  }
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Optional secondary description text */
  secondary?: string;
  /** Optional secondary description className */
  secondaryClassName?: string;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, secondary, secondaryClassName, children, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <p
          ref={ref}
          className={cn("text-sm text-neutral-500", className)}
          {...props}
        >
          {children}
        </p>
        {secondary && (
          <p
            className={cn(
              "text-xs text-neutral-400",
              secondaryClassName
            )}
            aria-label={`Additional information: ${secondary}`}
          >
            {secondary}
          </p>
        )}
      </div>
    );
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
