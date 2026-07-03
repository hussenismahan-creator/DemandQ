import type { AnalysisInput, AnalysisResult } from "@/types";
import { MockAnalysisProvider } from "./mock.provider";
import { LlmAnalysisProvider } from "./llm.provider";
import type { AnalysisProvider, AnalyzeOptions } from "./types";

export type { AnalysisProvider, AnalyzeOptions, AnalysisProgress, AnalysisPhase } from "./types";

/**
 * Provider factory. Selects the analysis backend at build time.
 *
 * Set `NEXT_PUBLIC_ANALYSIS_PROVIDER=llm` (and implement `LlmAnalysisProvider`)
 * to switch to a real model. Defaults to the local mock engine so the app is
 * fully functional with no API keys or network access.
 */
function resolveProvider(): AnalysisProvider {
  const configured = process.env.NEXT_PUBLIC_ANALYSIS_PROVIDER;
  if (configured === "llm") {
    return new LlmAnalysisProvider();
  }
  return new MockAnalysisProvider();
}

const provider = resolveProvider();

/**
 * The single entry point the UI uses to analyze an incident. Consumers never
 * touch a concrete provider — only this function and the `AnalysisResult` type.
 */
export function analyzeIncident(
  input: AnalysisInput,
  options?: AnalyzeOptions,
): Promise<AnalysisResult> {
  return provider.analyze(input, options);
}

export const activeProviderName = provider.name;
