import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "~/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // MD3 Filled Text Field (Menu variant)
      "flex h-14 w-full items-center justify-between",
      // Shape: rounded top corners only (4px)
      "rounded-t-md",
      // Surface: surface-variant background
      "bg-surface-variant",
      // Border: bottom border only (2px)
      "border-b-2 border-outline-variant",
      // Spacing: 16dp horizontal padding
      "px-4 py-2",
      // Typography: Body large (16px)
      "text-base leading-6",
      // State layers
      "hover:bg-on-surface/[0.08]",
      "focus:outline-none focus:border-primary focus:bg-on-surface/[0.12]",
      "data-[state=open]:border-primary data-[state=open]:bg-on-surface/[0.12]",
      // Disabled state
      "disabled:cursor-not-allowed disabled:opacity-38 disabled:bg-on-surface/[0.04]",
      // Text truncation
      "[&>span]:line-clamp-1",
      // Transition
      "transition-colors duration-200",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-on-surface-variant transition-transform duration-200 data-[state=open]:rotate-180"
      >
        <path
          d="M7 10L12 15L17 10H7Z"
          fill="currentColor"
        />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        d="M7.49999 3.04999C7.61933 3.04999 7.73379 3.0974 7.81819 3.18179L10.0682 5.43179C10.2439 5.60753 10.2439 5.89245 10.0682 6.06819C9.89245 6.24392 9.60753 6.24392 9.43179 6.06819L7.49999 4.13638L5.56819 6.06819C5.39245 6.24392 5.10753 6.24392 4.93179 6.06819C4.75605 5.89245 4.75605 5.60753 4.93179 5.43179L7.18179 3.18179C7.26618 3.0974 7.38064 3.04999 7.49999 3.04999Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        d="M7.49999 11.95C7.38064 11.95 7.26618 11.9026 7.18179 11.8182L4.93179 9.56819C4.75605 9.39245 4.75605 9.10753 4.93179 8.93179C5.10753 8.75606 5.39245 8.75606 5.56819 8.93179L7.49999 10.8636L9.43179 8.93179C9.60753 8.75606 9.89245 8.75606 10.0682 8.93179C10.2439 9.10753 10.2439 9.39245 10.0682 9.56819L7.81819 11.8182C7.73379 11.9026 7.61933 11.95 7.49999 11.95Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // MD3 Menu Surface
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        // Shape: Medium (12px border radius)
        "rounded-xl",
        // Surface: surface-container background
        "bg-surface-container",
        // Elevation: Level 2
        "shadow-lg",
        // Typography: on-surface text
        "text-on-surface",
        // Animation: emphasized easing
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          // MD3 Menu padding (8dp vertical)
          "py-2",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      // MD3 Label small (supporting text in menus)
      "text-[11px] leading-4 font-medium tracking-[0.5px]",
      // Color: on-surface-variant
      "text-on-surface-variant",
      // Spacing: 12dp horizontal padding, 8dp vertical
      "py-2 px-3",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // MD3 Menu Item
      "relative flex w-full cursor-pointer select-none items-center",
      // Shape: no border radius for items
      "rounded-none",
      // Height: 48dp minimum (12 units)
      "min-h-12",
      // Spacing: 12dp horizontal padding, 8dp vertical
      "py-2 pl-12 pr-3",
      // Typography: Body large (16px)
      "text-base leading-6",
      // State layers
      "hover:bg-on-surface/[0.08]",
      "focus:bg-on-surface/[0.12] focus:outline-none",
      "data-[state=checked]:bg-secondary-container data-[state=checked]:text-on-secondary-container",
      // Disabled state
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-38",
      // Transition
      "transition-colors duration-150",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-6 w-6 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            fill="currentColor"
          />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
