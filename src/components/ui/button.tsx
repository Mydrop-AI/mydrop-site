import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(90deg,#e6346c_0%,#c000f5_58%,#1d9bf0_100%)] text-white shadow-[0_10px_28px_rgba(192,0,245,0.28)] hover:opacity-95",
        outline:
          "border border-white/25 bg-transparent text-white hover:border-white/45 hover:bg-white/10",
        ghost: "bg-transparent text-slate-200 hover:bg-white/10 hover:text-white",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
