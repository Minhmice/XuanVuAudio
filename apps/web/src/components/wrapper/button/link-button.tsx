"use client";

import * as React from "react";

import { AppButton, type AppButtonProps } from "./app-button";

export type LinkButtonProps = Omit<AppButtonProps, "variant">;

export const LinkButton = React.forwardRef<HTMLButtonElement, LinkButtonProps>((props, ref) => (
  <AppButton ref={ref} variant="link" {...props} />
));

LinkButton.displayName = "LinkButton";
