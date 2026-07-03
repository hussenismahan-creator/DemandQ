"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/shared/animated-number";

interface StatCardProps {
  label: string;
  value: number;
  displayValue?: string;
  suffix?: string;
  delta?: number;
  /** When true, a negative delta is treated as good (e.g. time-to-insight). */
  invertDelta?: boolean;
  icon: LucideIcon;
  index?: number;
}

/** A single animated statistic card for the dashboard grid. */
export function StatCard({
  label,
  value,
  displayValue,
  suffix,
  delta,
  invertDelta = false,
  icon: Icon,
  index = 0,
}: StatCardProps) {
  const hasDelta = typeof delta === "number";
  const positive = hasDelta ? (invertDelta ? delta! < 0 : delta! > 0) : true;
  const DeltaIcon = hasDelta && delta! < 0 ? ArrowDownRight : ArrowUpRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <Card className="group relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {displayValue ?? <AnimatedNumber value={value} suffix={suffix} />}
          </span>
          {hasDelta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                positive ? "bg-success/10 text-success" : "bg-severity-critical/10 text-severity-critical",
              )}
            >
              <DeltaIcon className="h-3 w-3" />
              {Math.abs(delta!)}%
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
