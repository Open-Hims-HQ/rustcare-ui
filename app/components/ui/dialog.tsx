import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "~/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // MD3 Scrim (overlay background)
      "fixed inset-0 z-50",
      // Color: scrim with 32% opacity
      "bg-scrim/[0.32]",
      // Animation: fade in/out with emphasized easing
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      // Duration: medium2 (300ms)
      "data-[state=open]:duration-300 data-[state=closed]:duration-200",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // MD3 Dialog Container
        "fixed left-[50%] top-[50%] z-50",
        // Layout
        "grid w-full max-w-lg",
        // Transform: center the dialog
        "translate-x-[-50%] translate-y-[-50%]",
        // Spacing: 24dp gap between sections
        "gap-6",
        // Shape: Extra-large (28px border radius)
        "rounded-[28px]",
        // Surface: surface-container-high background
        "bg-surface-container-high",
        // Elevation: Level 3
        "shadow-xl",
        // Spacing: 24dp padding
        "p-6",
        // Animation: emphasized easing with scale + fade
        "duration-300",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-6 top-6 rounded-full p-2 text-on-surface-variant hover:bg-on-surface/[0.08] focus:bg-on-surface/[0.12] focus:outline-none disabled:pointer-events-none data-[state=open]:bg-on-surface/[0.12] transition-colors">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="currentColor"
          />
        </svg>
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // MD3 Dialog Header
      "flex flex-col",
      // Spacing: 16dp gap between icon/title and description
      "space-y-4",
      // Text alignment
      "text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // MD3 Dialog Actions
      "flex flex-row justify-end items-center",
      // Spacing: 8dp gap between buttons
      "gap-2",
      // Padding top: 16dp from content
      "pt-4",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // MD3 Headline Small (Dialog headline)
      "text-2xl leading-8 font-normal tracking-normal",
      // Color: on-surface
      "text-on-surface",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      // MD3 Body Medium (Dialog supporting text)
      "text-sm leading-5 font-normal tracking-[0.25px]",
      // Color: on-surface-variant
      "text-on-surface-variant",
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
