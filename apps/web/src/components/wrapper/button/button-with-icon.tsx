"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { AppButton, type AppButtonProps } from "./app-button";

export type ButtonWithIconProps = AppButtonProps & {
  icon: React.ReactNode;
  iconPosition?: "left" | "right";
};

export const ButtonWithIcon = React.forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  ({ icon, iconPosition = "left", children, className, ...props }, ref) => (
    <AppButton ref={ref} className={cn("inline-flex items-center gap-2", className)} {...props}>
      {iconPosition === "left" ? icon : null}
      {children}
      {iconPosition === "right" ? icon : null}
    </AppButton>
  ),
);

ButtonWithIcon.displayName = "ButtonWithIcon";
