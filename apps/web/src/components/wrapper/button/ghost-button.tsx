"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type GhostButtonProps = Omit<AppButtonProps, "variant">;

export const GhostButton = React.forwardRef<HTMLButtonElement, GhostButtonProps>((props, ref) => (
  <AppButton ref={ref} variant="ghost" {...props} />
));

GhostButton.displayName = "GhostButton";
