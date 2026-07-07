import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "hq-motion-btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_hsl(var(--primary)/0.25)] hover:bg-primary/92 hover:shadow-[0_4px_14px_hsl(var(--primary)/0.30)]",
        secondary:
          "border border-border/80 bg-secondary/80 text-secondary-foreground shadow-[0_1px_2px_hsl(228_40%_9%/0.04)] hover:bg-secondary hover:shadow-[0_4px_14px_hsl(228_40%_9%/0.08)]",
        ghost:
          "text-foreground hover:bg-accent/70",
        outline:
          "border border-border/80 bg-transparent text-foreground shadow-[0_1px_2px_hsl(228_40%_9%/0.03)] hover:border-border hover:bg-accent/40 hover:shadow-[0_4px_14px_hsl(228_40%_9%/0.06)]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
