"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type SecondaryButtonProps = Omit<AppButtonProps, "variant">;

export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>((props, ref) => (
  <AppButton ref={ref} variant="secondary" {...props} />
));

SecondaryButton.displayName = "SecondaryButton";
