import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--app-btn-outline-border)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "[background:var(--app-btn-primary)] border border-[var(--app-btn-primary-border)] text-[var(--app-btn-primary-text)] hover:[background:var(--app-btn-primary-hover)]",
        destructive:
          "bg-[linear-gradient(135deg,#7a2020_0%,#4a1010_100%)] border border-[rgba(255,140,140,0.3)] text-[#ffdce8] hover:brightness-110",
        outline:
          "bg-transparent border border-[var(--app-btn-outline-border)] text-[var(--app-btn-outline-text)] hover:bg-[var(--app-input-bg)] hover:border-[var(--app-btn-primary-border)]",
        secondary:
          "bg-[var(--app-card-bg)] border border-[var(--app-card-border)] text-[var(--app-body)] hover:text-[var(--app-heading)]",
        ghost:
          "bg-transparent text-[var(--app-link)] hover:bg-[var(--app-input-bg)] hover:text-[var(--app-heading)]",
        link: "bg-transparent text-[var(--app-link)] underline-offset-4 hover:underline hover:text-[var(--app-heading-em)]",
      },
      size: {
        default: "h-9 px-[1.4rem] py-[0.6rem] rounded-[2px] text-[0.88rem] tracking-[0.06em]",
        sm:      "h-8 px-3 rounded-[2px] text-xs tracking-[0.06em]",
        lg:      "h-11 px-8 rounded-[2px] text-[0.95rem] tracking-[0.08em]",
        icon:    "h-9 w-9 rounded-[2px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };