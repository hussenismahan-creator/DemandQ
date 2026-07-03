import {
  AlertCircle,
  ArrowUpCircle,
  SearchCheck,
  ShieldCheck,
  CheckCircle2,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { cn, formatTime, formatRelativeTime } from "@/lib/utils";
import type { TimelineEvent } from "@/types";

const EVENT_META: Record<TimelineEvent["type"], { icon: LucideIcon; tint: string; ring: string }> = {
  detection: { icon: AlertCircle, tint: "text-severity-high", ring: "bg-severity-high/10 border-severity-high/30" },
  escalation: { icon: ArrowUpCircle, tint: "text-severity-medium", ring: "bg-severity-medium/10 border-severity-medium/30" },
  diagnosis: { icon: SearchCheck, tint: "text-primary", ring: "bg-primary/10 border-primary/30" },
  mitigation: { icon: ShieldCheck, tint: "text-severity-low", ring: "bg-severity-low/10 border-severity-low/30" },
  resolution: { icon: CheckCircle2, tint: "text-success", ring: "bg-success/10 border-success/30" },
  note: { icon: StickyNote, tint: "text-muted-foreground", ring: "bg-muted/40 border-border/60" },
};

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

/** Vertical timeline of reconstructed incident events. */
export function Timeline({ events, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-6", className)}>
      {events.map((event, index) => {
        const meta = EVENT_META[event.type];
        const Icon = meta.icon;
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="relative flex gap-4">
            {!isLast && (
              <span
                className="absolute left-[19px] top-10 h-[calc(100%-8px)] w-px bg-gradient-to-b from-border to-border/20"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                meta.ring,
              )}
            >
              <Icon className={cn("h-4.5 w-4.5", meta.tint)} style={{ width: 18, height: 18 }} />
            </span>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                <time
                  className="text-xs tabular-nums text-muted-foreground"
                  dateTime={event.timestamp}
                  title={formatRelativeTime(event.timestamp)}
                >
                  {formatTime(event.timestamp)}
                </time>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
