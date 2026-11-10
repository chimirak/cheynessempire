import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cx-btn cx-btn-espresso t-btn",
        // Brand variants (sharp corners, fill wipes in from the left)
        ivory: "cx-btn cx-btn-ivory t-btn",
        espresso: "cx-btn cx-btn-espresso t-btn",
        outline: "cx-btn cx-btn-outline t-btn",
        "outline-light": "cx-btn cx-btn-outline-light t-btn",
        gold: "cx-btn cx-btn-gold t-btn",
        // Text button with a gold underline that draws on hover
        text: "cx-link t-btn min-h-11 px-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "",
        sm: "min-h-11 px-5",
        lg: "min-h-14 px-10",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
