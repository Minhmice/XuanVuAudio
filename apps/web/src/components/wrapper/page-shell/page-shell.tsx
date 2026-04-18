import * as React from "react";

import { cn } from "@/lib/utils";

type PageShellProps = React.ComponentProps<"main"> & {
  containerClassName?: string;
};

function PageShell({ className, containerClassName, children, ...props }: PageShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <main {...props} className={cn("mx-auto w-full max-w-6xl px-6 py-8", containerClassName)}>
        {children}
      </main>
    </div>
  );
}

export { PageShell };
