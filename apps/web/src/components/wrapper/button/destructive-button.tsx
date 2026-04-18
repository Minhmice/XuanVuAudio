"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type DestructiveButtonProps = Omit<AppButtonProps, "variant">;

export const DestructiveButton = React.forwardRef<HTMLButtonElement, DestructiveButtonProps>((props, ref) => (
  <AppButton ref={ref} variant="destructive" {...props} />
));

DestructiveButton.displayName = "DestructiveButton";
