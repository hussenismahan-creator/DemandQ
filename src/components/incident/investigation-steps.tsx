"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvestigationStep } from "@/types";

interface InvestigationStepsProps {
  steps: InvestigationStep[];
  className?: string;
  /** When true, checkboxes are interactive (local-only state). */
  interactive?: boolean;
}

/** Checklist of concrete next investigation steps. */
export function InvestigationSteps({ steps, className, interactive = true }: InvestigationStepsProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    () => Object.fromEntries(steps.map((s) => [s.id, s.completed])),
  );

  function toggle(id: string) {
    if (!interactive) return;
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <ol className={cn("space-y-2", className)}>
      {steps.map((step, index) => {
        const done = checked[step.id];
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => toggle(step.id)}
              disabled={!interactive}
              className={cn(
                "flex w-full items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 text-left transition-colors",
                interactive && "hover:border-border hover:bg-card/70",
                !interactive && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                  done ? "border-success bg-success text-success-foreground" : "border-border bg-transparent",
                )}
              >
                {done && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    done ? "text-muted-foreground line-through" : "text-foreground",
                  )}
                >
                  <span className="mr-1.5 text-xs text-muted-foreground/60">{index + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
