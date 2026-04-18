"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type OutlineButtonProps = Omit<AppButtonProps, "variant">;

export const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>((props, ref) => (
  <AppButton ref={ref} variant="outline" {...props} />
));

OutlineButton.displayName = "OutlineButton";
