import {
  Server,
  Database,
  ListTree,
  Zap,
  Network,
  Globe,
  Cog,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HealthIndicator } from "@/components/shared/health-indicator";
import type { AffectedComponent } from "@/types";

const TYPE_ICON: Record<AffectedComponent["type"], LucideIcon> = {
  service: Server,
  database: Database,
  queue: ListTree,
  cache: Zap,
  gateway: Network,
  external: Globe,
  job: Cog,
};

interface AffectedComponentsProps {
  components: AffectedComponent[];
  className?: string;
}

/** Grid of services/components implicated by the analysis. */
export function AffectedComponents({ components, className }: AffectedComponentsProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {components.map((component) => {
        const Icon = TYPE_ICON[component.type];
        return (
          <div
            key={component.id}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-colors hover:border-border"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-mono text-sm font-medium text-foreground">{component.name}</p>
                <HealthIndicator health={component.health} showLabel={false} />
              </div>
              <p className="mt-0.5 text-xs capitalize text-muted-foreground/70">{component.type}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{component.impact}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
