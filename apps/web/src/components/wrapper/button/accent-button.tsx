"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type AccentButtonProps = Omit<AppButtonProps, "variant">;

export const AccentButton = React.forwardRef<HTMLButtonElement, AccentButtonProps>((props, ref) => (
  <AppButton ref={ref} variant="accent" {...props} />
));

AccentButton.displayName = "AccentButton";
