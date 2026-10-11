"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/** iOS-style toggle: green when on. */
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "peer relative inline-flex h-[26px] w-[44px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 data-[state=checked]:bg-[#34c759] data-[state=unchecked]:bg-[var(--switch-off)] disabled:cursor-not-allowed disabled:opacity-50",
      // invisible 44px tap target on touch screens
      "before:absolute before:-inset-y-[9px] before:inset-x-0 before:content-[''] sm:before:hidden",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block h-[22px] w-[22px] translate-x-[2px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)] transition-transform duration-200 ease-[var(--ease)] data-[state=checked]:translate-x-[20px]" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
