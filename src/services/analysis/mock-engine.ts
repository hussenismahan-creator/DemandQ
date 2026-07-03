import type {
  AnalysisInput,
  AnalysisResult,
  IncidentReport,
  TimelineEvent,
  AffectedComponent,
  RecommendedFix,
  InvestigationStep,
} from "@/types";
import { createId } from "@/lib/utils";
import { INCIDENT_PATTERNS, GENERIC_PATTERN, type IncidentPattern } from "./patterns";

/** Score a pattern against the raw input by counting matched signals. */
function scorePattern(input: string, pattern: IncidentPattern): number {
  return pattern.signals.reduce((score, signal) => (signal.test(input) ? score + 1 : score), 0);
}

/** Select the best-matching pattern, or the generic fallback. */
function selectPattern(content: string): { pattern: IncidentPattern; matched: boolean } {
  let best: IncidentPattern | null = null;
  let bestScore = 0;

  for (const pattern of INCIDENT_PATTERNS) {
    const score = scorePattern(content, pattern);
    if (score > bestScore) {
      best = pattern;
      bestScore = score;
    }
  }

  if (best && bestScore > 0) {
    return { pattern: best, matched: true };
  }
  return { pattern: GENERIC_PATTERN, matched: false };
}

/**
 * Reconstruct a plausible incident timeline anchored to "now", working
 * backwards so the resolution reads as the most recent event.
 */
function buildTimeline(pattern: IncidentPattern): TimelineEvent[] {
  const now = Date.now();
  const minute = 60_000;

  const scaffold: Array<Pick<TimelineEvent, "title" | "description" | "type"> & { offset: number }> = [
    {
      offset: 34,
      type: "detection",
      title: "Anomaly detected",
      description: "Automated monitoring flagged an error-rate deviation above the alerting threshold.",
    },
    {
      offset: 30,
      type: "escalation",
      title: "On-call engineer paged",
      description: "The alert escalated to the on-call rotation and an incident channel was opened.",
    },
    {
      offset: 22,
      type: "diagnosis",
      title: "Root cause identified",
      description: pattern.rootCause,
    },
    {
      offset: 12,
      type: "mitigation",
      title: "Mitigation applied",
      description: pattern.fixes[0]?.description ?? "The primary remediation was applied to stop the impact.",
    },
    {
      offset: 2,
      type: "resolution",
      title: "Service recovered",
      description: "Error rates returned to baseline and the incident was marked resolved.",
    },
  ];

  return scaffold.map((event) => ({
    id: createId("evt"),
    timestamp: new Date(now - event.offset * minute).toISOString(),
    title: event.title,
    description: event.description,
    type: event.type,
  }));
}

function buildAffected(pattern: IncidentPattern): AffectedComponent[] {
  return pattern.affected.map((component) => ({
    id: createId("cmp"),
    name: component.name,
    type: component.type,
    health: component.health,
    impact: component.impact,
  }));
}

function buildFixes(pattern: IncidentPattern): RecommendedFix[] {
  return pattern.fixes.map((fix) => ({
    id: createId("fix"),
    title: fix.title,
    description: fix.description,
    effort: fix.effort,
    priority: fix.priority,
    codeSnippet: fix.codeSnippet,
    language: fix.language,
  }));
}

function buildSteps(pattern: IncidentPattern): InvestigationStep[] {
  return pattern.steps.map((step, index) => ({
    id: createId("stp"),
    title: step,
    detail:
      index === 0
        ? "Start here — this narrows the search space the fastest."
        : "Follow up once the previous step is confirmed.",
    completed: false,
  }));
}

function buildReport(
  pattern: IncidentPattern,
  timeline: TimelineEvent[],
  affected: AffectedComponent[],
  fixes: RecommendedFix[],
  steps: InvestigationStep[],
): IncidentReport {
  return {
    id: createId("rep"),
    executiveSummary: pattern.summary,
    severity: pattern.severity,
    rootCauseAnalysis: `${pattern.rootCause}\n\n${pattern.rootCauseExplanation}`,
    timeline,
    impactAnalysis: pattern.impact,
    affectedServices: affected,
    recommendedFixes: fixes,
    nextInvestigationSteps: steps,
    lessonsLearned: pattern.lessons,
    generatedAt: new Date().toISOString(),
    generatedBy: "DemandQ Analysis Engine (mock)",
  };
}

/**
 * The deterministic core of the mock analysis. Kept free of timers/async so it
 * is trivial to unit test; the provider layer adds the simulated latency.
 */
export function runMockAnalysis(input: AnalysisInput): AnalysisResult {
  const { pattern, matched } = selectPattern(input.content);

  const timeline = buildTimeline(pattern);
  const affected = buildAffected(pattern);
  const fixes = buildFixes(pattern);
  const steps = buildSteps(pattern);
  const report = buildReport(pattern, timeline, affected, fixes, steps);

  // Nudge confidence down slightly for short inputs — less signal to work with.
  const lengthPenalty = input.content.trim().length < 120 ? 12 : 0;
  const confidence = Math.max(40, pattern.confidence - lengthPenalty - (matched ? 0 : 0));

  return {
    id: createId("ana"),
    summary: pattern.summary,
    severity: pattern.severity,
    confidence,
    rootCause: pattern.rootCause,
    rootCauseExplanation: pattern.rootCauseExplanation,
    category: pattern.category,
    timeline,
    affectedComponents: affected,
    recommendedFixes: fixes,
    investigationSteps: steps,
    tags: pattern.tags,
    report,
  };
}

/** Derive a short, human title for an incident from its analysis. */
export function deriveIncidentTitle(result: AnalysisResult): string {
  return result.report.executiveSummary.split(".")[0]?.trim() ?? result.category;
}
