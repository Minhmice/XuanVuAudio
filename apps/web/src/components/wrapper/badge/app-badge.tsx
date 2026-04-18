import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AppBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return <Badge className={cn("font-headline uppercase tracking-widest", className)} {...props} />;
}
