import { Microscope, ShieldCheck, Boxes } from "lucide-react";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { ConfidenceMeter } from "@/components/shared/confidence-meter";

/** A static, framed mockup of the analyzer output shown in the hero. */
export function ProductPreview() {
  return (
    <div className="relative rounded-xl border border-border/60 bg-card/60 shadow-2xl backdrop-blur">
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-xl bg-gradient-to-b from-primary/20 to-transparent opacity-40 blur-lg" />

      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-severity-critical/70" />
        <span className="h-3 w-3 rounded-full bg-severity-medium/70" />
        <span className="h-3 w-3 rounded-full bg-success/70" />
        <span className="ml-3 rounded-md bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
          demandq.app/analyzer
        </span>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2">
        {/* Input */}
        <div className="overflow-hidden rounded-lg border border-border/60 bg-[hsl(240_10%_3%)]">
          <div className="border-b border-border/60 bg-muted/20 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
            production.log
          </div>
          <pre className="overflow-hidden p-3 text-[11px] leading-relaxed">
            <code className="font-mono text-foreground/80">
              <span className="text-severity-critical">ERROR</span> [checkout-service]{"\n"}
              timeout acquiring connection{"\n"}
              from pool (ECONNREFUSED){"\n"}
              <span className="text-severity-medium">WARN</span> [api-gateway] upstream{"\n"}
              returned 503 · 2411 queued{"\n"}
              <span className="text-severity-critical">ERROR</span> PoolExhausted:{"\n"}
              10/10 in use, 214 waiting
            </code>
          </pre>
        </div>

        {/* Result */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-card/60 p-3">
            <div>
              <div className="flex items-center gap-1.5">
                <SeverityBadge severity="critical" />
              </div>
              <p className="mt-2 text-xs font-semibold text-foreground">
                Database connection pool exhaustion
              </p>
            </div>
            <ConfidenceMeter value={92} size={72} strokeWidth={7} />
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-card/40 p-3">
            <Microscope className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Connections weren&apos;t released under load while the pool ceiling sat below peak concurrency.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 p-2.5">
              <Boxes className="h-4 w-4 text-severity-low" />
              <span className="text-[11px] text-muted-foreground">3 services</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 p-2.5">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span className="text-[11px] text-muted-foreground">3 fixes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
