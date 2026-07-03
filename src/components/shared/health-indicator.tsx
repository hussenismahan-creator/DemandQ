import { cn } from "@/lib/utils";
import { HEALTH_META } from "@/lib/constants";
import type { ServiceHealth } from "@/types";

interface HealthIndicatorProps {
  health: ServiceHealth;
  className?: string;
  showLabel?: boolean;
}

/** A small dot + label reflecting a service's operational health. */
export function HealthIndicator({ health, className, showLabel = true }: HealthIndicatorProps) {
  const meta = HEALTH_META[health];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
      {showLabel && <span className={cn("text-xs font-medium", meta.text)}>{meta.label}</span>}
    </span>
  );
}
