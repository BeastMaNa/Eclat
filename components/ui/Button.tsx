"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-sm font-medium tracking-wide transition-all duration-[250ms] ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-bone hover:bg-ink/80 px-7 py-3",
        accent:
          "bg-accent text-ink hover:bg-accent-deep px-7 py-3",
        outline:
          "border border-ink text-ink hover:bg-ink hover:text-bone px-7 py-3",
        ghost:
          "text-ink hover:text-accent underline-offset-4 hover:underline px-0 py-0",
        link:
          "text-accent underline underline-offset-4 hover:text-accent-deep px-0 py-0",
      },
      size: {
        sm: "text-xs px-4 py-2",
        md: "",
        lg: "text-base px-9 py-4",
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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

export { Button, buttonVariants };
