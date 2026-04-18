import * as React from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  actions,
  className,
  align = "left",
}: SectionHeaderProps) {
  const resolvedAction = actions ?? action;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <div className="font-headline text-[11px] font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
        ) : null}
        <h2 className="font-headline text-[32px] font-bold uppercase tracking-tighter text-[var(--text-primary)]">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {resolvedAction ? <div>{resolvedAction}</div> : null}
    </div>
  );
}
