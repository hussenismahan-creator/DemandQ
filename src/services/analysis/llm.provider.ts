import type { AnalysisInput, AnalysisResult } from "@/types";
import type { AnalysisProvider, AnalyzeOptions } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * FUTURE LLM PROVIDER — integration seam for OpenAI / Anthropic.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This class is intentionally unimplemented. It documents exactly where and
 * how a real model would be wired in. The rest of the application depends only
 * on the `AnalysisProvider` interface, so switching from the mock engine to a
 * real backend requires *only* completing this file and registering it in
 * `index.ts` — no UI changes.
 *
 * Recommended implementation sketch:
 *
 *   1. Move this call server-side (a Next.js Route Handler or Server Action)
 *      so the API key never reaches the browser.
 *   2. Send `input.content` with a system prompt that asks the model to return
 *      JSON matching the `AnalysisResult` shape (use tool/function calling or
 *      structured outputs to guarantee the schema).
 *   3. Validate the response (e.g. with zod) before returning it.
 *
 * Example (Anthropic — pseudo-code, do not enable without a server route):
 *
 *   const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 *   const message = await anthropic.messages.create({
 *     model: "claude-sonnet-5",
 *     max_tokens: 4096,
 *     system: INCIDENT_ANALYST_SYSTEM_PROMPT,
 *     messages: [{ role: "user", content: input.content }],
 *     tools: [ANALYSIS_RESULT_TOOL], // enforces the JSON schema
 *   });
 *   return AnalysisResultSchema.parse(extractToolResult(message));
 */
export class LlmAnalysisProvider implements AnalysisProvider {
  readonly name = "llm";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async analyze(_input: AnalysisInput, _options?: AnalyzeOptions): Promise<AnalysisResult> {
    throw new Error(
      "LlmAnalysisProvider is not implemented yet. Wire up OpenAI/Anthropic in a " +
        "server route and register this provider in services/analysis/index.ts.",
    );
  }
}
