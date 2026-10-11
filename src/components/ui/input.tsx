import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          // 16px on phones so iOS doesn't zoom into the field on focus
          "flex h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-[16px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50 aria-[invalid=true]:border-danger sm:text-[15px]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
