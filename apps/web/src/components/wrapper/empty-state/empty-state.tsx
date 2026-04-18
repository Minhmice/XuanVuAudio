import * as React from "react";

import { AppCard, AppCardContent } from "@/components/wrapper/card";
import { cn } from "@/lib/utils";

type EmptyStateProps = React.ComponentProps<"div"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

function EmptyState({ title, description, action, children, className, ...props }: EmptyStateProps) {
  const resolvedTitle = title ?? children;

  return (
    <AppCard className={cn("border-dashed bg-muted/30", className)} {...props}>
      <AppCardContent className="flex flex-col items-center justify-center px-4 py-10 text-center">
        {resolvedTitle ? <p className="text-sm font-medium text-foreground">{resolvedTitle}</p> : null}
        {description ? <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p> : null}
        {action ? <div className="mt-4">{action}</div> : null}
      </AppCardContent>
    </AppCard>
  );
}

export { EmptyState };
