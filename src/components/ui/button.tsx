import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-normal transition-[background-color,color,box-shadow,transform,filter] duration-200 ease-out disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-fill text-foreground hover:bg-fill-hover",
        ghost: "text-foreground hover:bg-fill",
        outline: "text-link shadow-[inset_0_0_0_1px_var(--link)] hover:bg-link hover:text-white",
        danger: "bg-danger text-white hover:brightness-110",
        link: "text-link hover:underline active:scale-100",
      },
      size: {
        /* sm keeps a 44px tap target on touch screens (触屏下满足 44px 点按目标) */
        sm: "h-8 px-3.5 text-[13px] max-sm:h-11 max-sm:px-4 max-sm:text-[15px]",
        md: "h-10 px-5 text-[15px]",
        lg: "h-12 px-6 text-[17px]",
        icon: "h-9 w-9 max-sm:h-11 max-sm:w-11",
        nav: "h-7 px-3 text-[12px] font-medium",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
