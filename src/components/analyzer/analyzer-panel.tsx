"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Zap, ShieldCheck, GitBranch } from "lucide-react";
import { useAnalysis } from "@/hooks/use-analysis";
import { InputEditor } from "./input-editor";
import { AnalyzingState } from "./analyzing-state";
import { AnalysisResults } from "./analysis-results";

const HINTS = [
  { icon: Zap, title: "Instant root cause", body: "Paste raw output — get the most likely cause with a confidence score." },
  { icon: GitBranch, title: "Correlated timeline", body: "Events are reconstructed and mapped to the services they touched." },
  { icon: ShieldCheck, title: "Shareable report", body: "A professional, sectioned incident report is generated automatically." },
];

/** Orchestrates the analyzer's idle → analyzing → results lifecycle. */
export function AnalyzerPanel() {
  const { status, progress, result, analyze, cancel, reset } = useAnalysis();

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {status === "analyzing" && (
          <motion.div key="analyzing" exit={{ opacity: 0 }}>
            <AnalyzingState progress={progress} onCancel={cancel} />
          </motion.div>
        )}

        {(status === "done" || status === "error") && result && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnalysisResults result={result} onReset={reset} />
          </motion.div>
        )}

        {(status === "idle" || status === "error") && !result && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <InputEditor onAnalyze={analyze} />

            <div className="grid gap-4 sm:grid-cols-3">
              {HINTS.map((hint) => {
                const Icon = hint.icon;
                return (
                  <div key={hint.title} className="rounded-xl border border-border/60 bg-card/40 p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">{hint.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint.body}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
