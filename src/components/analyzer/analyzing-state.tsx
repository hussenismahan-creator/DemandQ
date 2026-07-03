"use client";

import { motion } from "framer-motion";
import { Check, Loader2, ScanSearch, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { AnalysisProgress, AnalysisPhase } from "@/services/analysis";

interface AnalyzingStateProps {
  progress: AnalysisProgress | null;
  onCancel: () => void;
}

const PHASE_ORDER: { phase: AnalysisPhase; label: string }[] = [
  { phase: "queued", label: "Queued for analysis" },
  { phase: "parsing", label: "Parsing logs & extracting signals" },
  { phase: "correlating", label: "Correlating events across services" },
  { phase: "diagnosing", label: "Diagnosing the most likely root cause" },
  { phase: "drafting", label: "Drafting the incident report" },
];

function phaseIndex(phase?: AnalysisPhase): number {
  if (!phase) return -1;
  if (phase === "complete") return PHASE_ORDER.length;
  return PHASE_ORDER.findIndex((p) => p.phase === phase);
}

/** Full-panel loading experience with animated pulse and per-phase progress. */
export function AnalyzingState({ progress, onCancel }: AnalyzingStateProps) {
  const current = phaseIndex(progress?.phase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border/60 bg-card"
    >
      <div className="flex flex-col items-center border-b border-border/60 px-6 py-10 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/40" />
          <span className="absolute inset-2 animate-pulse-ring rounded-full bg-primary/30 [animation-delay:0.4s]" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(280_86%_66%)] text-primary-foreground shadow-lg">
            <ScanSearch className="h-7 w-7" />
          </span>
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground">Analyzing incident</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {progress?.message ?? "Warming up the analysis engine…"}
        </p>

        <div className="mt-6 w-full max-w-md">
          <Progress value={progress?.percent ?? 4} />
          <div className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{progress?.message ?? "Starting"}</span>
            <span>{Math.round(progress?.percent ?? 4)}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 p-4">
        {PHASE_ORDER.map((item, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <div
              key={item.phase}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active && "bg-primary/5",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="h-3 w-3" />
                ) : active ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  done ? "text-muted-foreground" : active ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center border-t border-border/60 p-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-3.5 w-3.5" />
          Cancel analysis
        </Button>
      </div>
    </motion.div>
  );
}
