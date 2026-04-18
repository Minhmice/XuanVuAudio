import * as React from "react";

import { cn } from "@/lib/utils";

export type ButtonGroupProps = React.ComponentProps<"div"> & {
  /** When true, visually join child buttons (no gap, shared radius). */
  joined?: boolean;
};

export function ButtonGroup({ className, joined, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center",
        joined
          ? "[&>button]:rounded-none [&>button:first-child]:rounded-l-sm [&>button:last-child]:rounded-r-sm [&>button:not(:first-child)]:border-l-0"
          : "gap-2",
        className,
      )}
      {...props}
    />
  );
}
