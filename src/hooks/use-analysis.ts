"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { AnalysisInput, AnalysisResult } from "@/types";
import { analyzeIncident, type AnalysisProgress } from "@/services/analysis";
import { incidentsService } from "@/services/incidents";
import { reportsService } from "@/services/reports";

export type AnalysisStatus = "idle" | "analyzing" | "done" | "error";

interface UseAnalysisReturn {
  status: AnalysisStatus;
  progress: AnalysisProgress | null;
  result: AnalysisResult | null;
  error: string | null;
  analyze: (input: AnalysisInput) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

/**
 * Encapsulates the analyzer state machine: idle → analyzing → done|error.
 * Persists the resulting incident + report into the mock stores so they appear
 * across History and Reports. The UI depends only on this hook, never the
 * provider directly.
 */
export function useAnalysis(): UseAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (input: AnalysisInput) => {
    setStatus("analyzing");
    setError(null);
    setResult(null);
    setProgress(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const analysis = await analyzeIncident(input, {
        signal: controller.signal,
        onProgress: setProgress,
      });

      // Persist so the incident/report surface elsewhere in the app.
      reportsService.register(analysis.report);
      await incidentsService.createFromAnalysis(input, analysis);

      setResult(analysis);
      setStatus("done");
      toast.success("Analysis complete", {
        description: "Root cause identified and report generated.",
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      const message = err instanceof Error ? err.message : "Analysis failed unexpectedly.";
      setError(message);
      setStatus("error");
      toast.error("Analysis failed", { description: message });
    } finally {
      controllerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    setStatus("idle");
    setProgress(null);
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setStatus("idle");
    setProgress(null);
    setResult(null);
    setError(null);
  }, []);

  return { status, progress, result, error, analyze, cancel, reset };
}
