import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AppInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input className={cn("shadow-xs", className)} {...props} />;
}
