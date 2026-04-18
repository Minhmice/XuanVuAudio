"use client";

import * as React from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { wrapperButtonVariants, type WrapperButtonVariantProps } from "./variants";

export type AppButtonProps = Omit<React.ComponentProps<typeof Button>, "variant" | "size"> &
  WrapperButtonVariantProps & {
    isLoading?: boolean;
  };

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, asChild, ...props }, ref) => {
    if (asChild) {
      return (
        <Button ref={ref} asChild className={cn(wrapperButtonVariants({ variant, size }), className)} {...props}>
          {children}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        className={cn(wrapperButtonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </Button>
    );
  },
);

AppButton.displayName = "AppButton";

export { AppButton, wrapperButtonVariants };
