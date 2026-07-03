import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Incident } from "@/types";
import { ROUTES, SOURCE_META } from "@/lib/constants";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";

interface IncidentListItemProps {
  incident: Incident;
  className?: string;
  /** Compact variant used on the dashboard. */
  compact?: boolean;
}

/** A single incident row, linking to its detail page. Reused everywhere. */
export function IncidentListItem({ incident, className, compact = false }: IncidentListItemProps) {
  return (
    <Link
      href={`${ROUTES.incidents}/${incident.id}`}
      className={cn(
        "group flex items-center gap-4 rounded-lg border border-transparent px-3 py-3 transition-colors hover:border-border/60 hover:bg-accent/40",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{incident.reference}</span>
          <SeverityBadge severity={incident.severity} withDot={!compact} />
        </div>
        <p className="mt-1 truncate text-sm font-medium text-foreground group-hover:text-foreground">
          {incident.title}
        </p>
        {!compact && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {incident.service} · {SOURCE_META[incident.source].label}
          </p>
        )}
      </div>

      <div className="hidden shrink-0 items-center gap-4 sm:flex">
        <StatusBadge status={incident.status} />
        <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
          {formatRelativeTime(incident.createdAt)}
        </span>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
    </Link>
  );
}
