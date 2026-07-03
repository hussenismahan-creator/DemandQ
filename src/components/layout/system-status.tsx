import { activeProviderName } from "@/services/analysis";

/** Compact "all systems operational" widget for the sidebar footer. */
export function SystemStatus() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="text-xs font-medium text-muted-foreground">All systems operational</span>
      </div>
      <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {activeProviderName}
      </span>
    </div>
  );
}
