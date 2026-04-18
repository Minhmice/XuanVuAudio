import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AppCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card className={cn("shadow-xs", className)} {...props} />;
}

export const AppCardHeader = CardHeader;
export const AppCardTitle = CardTitle;
export const AppCardDescription = CardDescription;
export const AppCardContent = CardContent;
