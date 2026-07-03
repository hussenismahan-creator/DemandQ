"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

interface ConfidenceMeterProps {
  /** 0–100 confidence score. */
  value: number;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

function toneFor(value: number): { stroke: string; text: string; label: string } {
  if (value >= 85) return { stroke: "hsl(var(--success))", text: "text-success", label: "High confidence" };
  if (value >= 65) return { stroke: "hsl(var(--severity-low))", text: "text-severity-low", label: "Moderate confidence" };
  if (value >= 45) return { stroke: "hsl(var(--warning))", text: "text-warning", label: "Low confidence" };
  return { stroke: "hsl(var(--severity-critical))", text: "text-severity-critical", label: "Very low confidence" };
}

/** A circular confidence gauge with an animated arc. */
export function ConfidenceMeter({ value, className, size = 132, strokeWidth = 10 }: ConfidenceMeterProps) {
  const safe = clamp(value, 0, 100);
  const tone = toneFor(safe);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-semibold tabular-nums", tone.text)}>{Math.round(safe)}</span>
        <span className="text-[11px] font-medium text-muted-foreground">confidence</span>
      </div>
      <span className={cn("mt-3 text-xs font-medium", tone.text)}>{tone.label}</span>
    </div>
  );
}
