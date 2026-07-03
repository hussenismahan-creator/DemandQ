import { cn } from "@/lib/utils";
import { SEVERITY_META } from "@/lib/constants";
import type { Severity } from "@/types";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  withDot?: boolean;
}

/** A pill representing incident severity, colored by the shared token map. */
export function SeverityBadge({ severity, className, withDot = true }: SeverityBadgeProps) {
  const meta = SEVERITY_META[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      {withDot && <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />}
      {meta.label}
    </span>
  );
}
