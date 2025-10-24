import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-neutral-50 text-neutral-900 border-neutral-200",
        success: "bg-success-50 text-success-900 border-success-200",
        warning: "bg-warning-50 text-warning-900 border-warning-200",
        danger: "bg-danger-50 text-danger-900 border-danger-200",
        info: "bg-primary-50 text-primary-900 border-primary-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  const icons = {
    default: Info,
    success: CheckCircle,
    warning: AlertCircle,
    danger: XCircle,
    info: Info,
  };

  const Icon = variant ? icons[variant] : icons.default;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
