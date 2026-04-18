import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(140,180,255,0.5)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - deep blue gradient //
        default:
          "bg-[linear-gradient(135deg,#2a4cad_0%,#1a2e6e_100%)] border border-[rgba(140,180,255,0.3)] text-[#dce8ff] hover:brightness-110 hover:border-[rgba(140,180,255,0.5)]",
        // Destructive - deep red gradient //
        destructive:
          "bg-[linear-gradient(135deg,#7a2020_0%,#4a1010_100%)] border border-[rgba(255,140,140,0.3)] text-[#ffdce8] hover:brightness-110",
        // Outline - transparent with faint blue border //
        outline:
          "bg-transparent border border-[rgba(140,180,255,0.2)] text-[#8ab4ff] hover:bg-[rgba(140,180,255,0.07)] hover:border-[rgba(140,180,255,0.35)]",
        // Secondary - slightly more opaque dark //
        secondary:
          "bg-[rgba(10,15,35,0.7)] border border-[rgba(140,180,255,0.15)] text-[#9aaccc] hover:bg-[rgba(20,30,60,0.8)] hover:text-[#dce8ff]",
        // Ghost - no border + subtle hover //
        ghost:
          "bg-transparent text-[#8ab4ff] hover:bg-[rgba(140,180,255,0.08)] hover:text-[#dce8ff]",
        // Link //
        link: "bg-transparent text-[#4a7acc] underline-offset-4 hover:underline hover:text-[#8ab4ff]",
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