import type { AnalysisInput, AnalysisResult } from "@/types";

/** Progress phases surfaced to the UI during analysis. */
export type AnalysisPhase =
  | "queued"
  | "parsing"
  | "correlating"
  | "diagnosing"
  | "drafting"
  | "complete";

export interface AnalysisProgress {
  phase: AnalysisPhase;
  /** 0–100 overall progress. */
  percent: number;
  message: string;
}

export interface AnalyzeOptions {
  /** Optional callback invoked as the analysis moves through phases. */
  onProgress?: (progress: AnalysisProgress) => void;
  /** Abort signal so the UI can cancel an in-flight analysis. */
  signal?: AbortSignal;
}

/**
 * The contract every analysis backend must satisfy. Swapping the mock engine
 * for a real OpenAI/Anthropic implementation means implementing this interface
 * — the UI and the rest of the app depend only on this shape.
 */
export interface AnalysisProvider {
  readonly name: string;
  analyze(input: AnalysisInput, options?: AnalyzeOptions): Promise<AnalysisResult>;
}
