"use client";

import { motion } from "framer-motion";
import { RotateCcw, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import type { AnalysisResult } from "@/types";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { ConfidenceMeter } from "@/components/shared/confidence-meter";

interface ResultHeroProps {
  result: AnalysisResult;
  onReset: () => void;
}

/** The headline card summarizing an analysis: summary, severity, confidence. */
export function ResultHero({ result, onReset }: ResultHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-b from-card to-card/40 p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-1.5">
              <Sparkles className="h-3 w-3" /> Analysis complete
            </Badge>
            <SeverityBadge severity={result.severity} />
            <Badge variant="muted">{result.category}</Badge>
          </div>

          <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground">
            {result.summary}
          </h2>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {result.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button size="sm" asChild>
              <Link href={`${ROUTES.reports}/${result.report.id}`}>
                <FileText className="h-4 w-4" />
                View full report
              </Link>
            </Button>
            <Button size="sm" variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              New analysis
            </Button>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card/60 p-6 lg:w-56">
          <ConfidenceMeter value={result.confidence} />
        </div>
      </div>
    </motion.div>
  );
}
