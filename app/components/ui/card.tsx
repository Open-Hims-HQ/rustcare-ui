import * as React from "react";
import { cn } from "~/lib/utils";
import { useOptionalPermission } from "~/hooks/usePermissions";
import type { PermissionCheck } from "~/lib/permissions";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, permission, hideIfDenied = false, ...props }, ref) => {
    const hasPermission = useOptionalPermission(permission);

    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl bg-white border border-neutral-200 shadow-sm transition-all duration-200",
          "hover:shadow-md hover:border-neutral-300",
          permission && !hasPermission && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, permission, hideIfDenied = false, ...props }, ref) => {
    const hasPermission = useOptionalPermission(permission);

    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-2 p-6 pb-4",
          permission && !hasPermission && "opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Optional secondary label text displayed alongside the title */
  secondary?: string;
  /** Optional secondary label className for styling */
  secondaryClassName?: string;
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, secondary, secondaryClassName, permission, hideIfDenied = false, children, ...props }, ref) => {
    const titleId = React.useId();
    const hasPermission = useOptionalPermission(permission);

    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    return (
      <div className="flex items-baseline justify-between gap-3">
        <h3
          ref={ref}
          id={titleId}
          className={cn(
            "text-xl font-semibold leading-tight tracking-tight text-neutral-900",
            permission && !hasPermission && "opacity-50",
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
              permission && !hasPermission && "opacity-50",
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
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, secondary, secondaryClassName, permission, hideIfDenied = false, children, ...props }, ref) => {
    const hasPermission = useOptionalPermission(permission);

    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    return (
      <div className="space-y-1.5">
        <p
          ref={ref}
          className={cn(
            "text-sm text-neutral-600 leading-relaxed",
            permission && !hasPermission && "opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </p>
        {secondary && (
          <p
            className={cn(
              "text-xs text-neutral-400",
              permission && !hasPermission && "opacity-50",
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

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, permission, hideIfDenied = false, ...props }, ref) => {
    const hasPermission = useOptionalPermission(permission);

    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "px-6 py-4",
          permission && !hasPermission && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, permission, hideIfDenied = false, ...props }, ref) => {
    const hasPermission = useOptionalPermission(permission);

    if (permission && !hasPermission && hideIfDenied) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 px-6 py-4 pt-0",
          permission && !hasPermission && "opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
