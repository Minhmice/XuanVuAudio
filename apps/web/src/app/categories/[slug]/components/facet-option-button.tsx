import { cn } from "@/lib/utils";

export function FacetOptionButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md border px-2 py-1.5 text-left text-sm transition hover:bg-muted/50",
        active ? "border-primary bg-muted/30" : "border-transparent",
      )}
    >
      <span className="line-clamp-2">{label}</span>
      {typeof count === "number" ? <span className="text-xs text-muted-foreground">{count}</span> : null}
    </button>
  );
}
