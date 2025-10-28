import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "~/lib/utils"
import { useOptionalPermission } from "~/hooks/usePermissions"
import type { PermissionCheck } from "~/lib/permissions"

interface NavigationMenuProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  NavigationMenuProps
>(({ className, children, permission, hideIfDenied = false, ...props }, ref) => {
  const hasPermission = useOptionalPermission(permission);

  if (permission && !hasPermission && hideIfDenied) {
    return null;
  }

  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn(
        "relative z-10 flex max-w-max flex-1 items-center justify-center",
        permission && !hasPermission && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
})
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

interface NavigationMenuListProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  NavigationMenuListProps
>(({ className, permission, hideIfDenied = false, ...props }, ref) => {
  const hasPermission = useOptionalPermission(permission);

  if (permission && !hasPermission && hideIfDenied) {
    return null;
  }

  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        permission && !hasPermission && "opacity-50",
        className
      )}
      {...props}
    />
  );
})
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50"
)

interface NavigationMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, permission, hideIfDenied = false, ...props }, ref) => {
  const hasPermission = useOptionalPermission(permission);

  if (permission && !hasPermission && hideIfDenied) {
    return null;
  }

  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cn(
        navigationMenuTriggerStyle(), 
        "group",
        permission && !hasPermission && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={permission ? !hasPermission || props.disabled : props.disabled}
      {...props}
    >
      {children}{" "}
      <ChevronDown
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
})
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

interface NavigationMenuContentProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  NavigationMenuContentProps
>(({ className, permission, hideIfDenied = false, ...props }, ref) => {
  const hasPermission = useOptionalPermission(permission);

  if (permission && !hasPermission && hideIfDenied) {
    return null;
  }

  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
        permission && !hasPermission && "opacity-50",
        className
      )}
      {...props}
    />
  );
})
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

interface NavigationMenuLinkProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> {
  permission?: PermissionCheck;
  hideIfDenied?: boolean;
}

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  NavigationMenuLinkProps
>(({ permission, hideIfDenied = false, className, ...props }, ref) => {
  const hasPermission = useOptionalPermission(permission);

  if (permission && !hasPermission && hideIfDenied) {
    return null;
  }

  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={cn(
        permission && !hasPermission && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    />
  );
})
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-slate-200 shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
