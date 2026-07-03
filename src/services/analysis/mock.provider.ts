import type { AnalysisInput, AnalysisResult } from "@/types";
import { delay } from "@/lib/utils";
import { runMockAnalysis } from "./mock-engine";
import type { AnalysisProvider, AnalyzeOptions, AnalysisProgress } from "./types";

const PHASES: AnalysisProgress[] = [
  { phase: "queued", percent: 8, message: "Queuing incident for analysis" },
  { phase: "parsing", percent: 26, message: "Parsing logs and extracting signals" },
  { phase: "correlating", percent: 48, message: "Correlating events across services" },
  { phase: "diagnosing", percent: 72, message: "Diagnosing the most likely root cause" },
  { phase: "drafting", percent: 91, message: "Drafting the incident report" },
  { phase: "complete", percent: 100, message: "Analysis complete" },
];

/**
 * The default provider. Produces a realistic analysis from a local rule-based
 * engine with simulated streaming progress and latency — no network, no LLM.
 *
 * To ship a real backend, implement `AnalysisProvider` (see `llm.provider.ts`)
 * and register it in `index.ts`.
 */
export class MockAnalysisProvider implements AnalysisProvider {
  readonly name = "mock";

  async analyze(input: AnalysisInput, options?: AnalyzeOptions): Promise<AnalysisResult> {
    const perPhase = 420;

    for (const progress of PHASES) {
      if (options?.signal?.aborted) {
        throw new DOMException("Analysis cancelled", "AbortError");
      }
      options?.onProgress?.(progress);
      if (progress.phase !== "complete") {
        await delay(perPhase);
      }
    }

    return runMockAnalysis(input);
  }
}
