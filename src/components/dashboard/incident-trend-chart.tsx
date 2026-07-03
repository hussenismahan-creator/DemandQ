"use client";

import { motion } from "framer-motion";
import type { TrendPoint } from "@/types";

interface IncidentTrendChartProps {
  data: TrendPoint[];
}

/** A lightweight animated bar chart — no external charting dependency. */
export function IncidentTrendChart({ data }: IncidentTrendChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-40 items-end justify-between gap-2">
      {data.map((point, index) => {
        const heightPct = (point.value / max) * 100;
        return (
          <div key={point.label} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-full w-full items-end justify-center">
              <motion.div
                className="w-full max-w-[36px] rounded-md bg-gradient-to-t from-primary/40 to-primary shadow-[0_0_12px_-4px_hsl(var(--primary))]"
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
              >
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded-md border border-border/60 bg-popover px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {point.value}
                </span>
              </motion.div>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}
