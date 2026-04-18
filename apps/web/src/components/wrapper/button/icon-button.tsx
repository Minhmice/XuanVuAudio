"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type IconButtonProps = Omit<AppButtonProps, "size">;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "primary", ...props }, ref) => <AppButton ref={ref} variant={variant} size="icon" {...props} />,
);

IconButton.displayName = "IconButton";
