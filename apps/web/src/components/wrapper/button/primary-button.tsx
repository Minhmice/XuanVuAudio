"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type PrimaryButtonProps = Omit<AppButtonProps, "variant">;

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>((props, ref) => (
  <AppButton ref={ref} variant="primary" {...props} />
));

PrimaryButton.displayName = "PrimaryButton";
