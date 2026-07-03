"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SEVERITY_META } from "@/lib/constants";
import type { Severity } from "@/types";

interface SeverityBreakdownProps {
  data: { severity: string; count: number }[];
}

/** Horizontal distribution of incidents by severity. */
export function SeverityBreakdown({ data }: SeverityBreakdownProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <div className="space-y-3">
      {data.map((row, index) => {
        const meta = SEVERITY_META[row.severity as Severity];
        const pct = Math.round((row.count / total) * 100);
        return (
          <div key={row.severity} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                {meta.label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {row.count} · {pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn("h-full rounded-full", meta.dot)}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: index * 0.07, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
