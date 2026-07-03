import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/constants";
import type { IncidentStatus } from "@/types";

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

/** A pill representing incident lifecycle status. Pulses while analyzing. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  const isLive = status === "analyzing" || status === "investigating";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isLive && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", meta.dot)} />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", meta.dot)} />
      </span>
      {meta.label}
    </span>
  );
}
