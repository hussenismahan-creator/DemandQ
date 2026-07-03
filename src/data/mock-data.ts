import type {
  Incident,
  IncidentReport,
  DashboardStats,
  TrendPoint,
  TimelineEvent,
  AffectedComponent,
  RecommendedFix,
  InvestigationStep,
  IncidentStatus,
  InputSource,
} from "@/types";
import { INCIDENT_PATTERNS, type IncidentPattern } from "@/services/analysis/patterns";

/**
 * Deterministic mock dataset.
 *
 * Timestamps are anchored to a fixed reference instant (not `Date.now()`) so
 * the server and client render identical markup — no hydration mismatch — and
 * the demo data is stable across reloads. Reports are assembled from the shared
 * pattern knowledge base to avoid duplicating incident content.
 */

const REFERENCE = Date.parse("2026-07-03T09:00:00.000Z");
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

function isoAgo(offsetMs: number): string {
  return new Date(REFERENCE - offsetMs).toISOString();
}

interface Seed {
  ref: string;
  patternId: string;
  status: IncidentStatus;
  source: InputSource;
  createdOffset: number; // ms before REFERENCE
}

const SEEDS: Seed[] = [
  { ref: "INC-1042", patternId: "db-connection-pool", status: "resolved", source: "logs", createdOffset: 3 * HOUR },
  { ref: "INC-1041", patternId: "oom-kill", status: "investigating", source: "terminal", createdOffset: 8 * HOUR },
  { ref: "INC-1040", patternId: "rate-limit", status: "analyzed", source: "logs", createdOffset: 26 * HOUR },
  { ref: "INC-1039", patternId: "null-pointer", status: "resolved", source: "stack_trace", createdOffset: 2 * 24 * HOUR },
  { ref: "INC-1038", patternId: "deploy-regression", status: "resolved", source: "terminal", createdOffset: 3 * 24 * HOUR },
  { ref: "INC-1037", patternId: "db-connection-pool", status: "analyzing", source: "logs", createdOffset: 20 * MINUTE },
  { ref: "INC-1036", patternId: "null-pointer", status: "analyzed", source: "error_message", createdOffset: 5 * 24 * HOUR },
  { ref: "INC-1035", patternId: "rate-limit", status: "resolved", source: "logs", createdOffset: 6 * 24 * HOUR },
  { ref: "INC-1034", patternId: "oom-kill", status: "resolved", source: "file_upload", createdOffset: 8 * 24 * HOUR },
];

function patternById(id: string): IncidentPattern {
  const found = INCIDENT_PATTERNS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown mock pattern: ${id}`);
  return found;
}

function serviceFor(pattern: IncidentPattern): string {
  return pattern.affected[0]?.name ?? "application-service";
}

function buildTimeline(seed: Seed, pattern: IncidentPattern): TimelineEvent[] {
  const base = seed.createdOffset;
  const scaffold: Array<{ offset: number; type: TimelineEvent["type"]; title: string; description: string }> = [
    { offset: base, type: "detection", title: "Anomaly detected", description: "Monitoring flagged an error-rate deviation above threshold." },
    { offset: base - 4 * MINUTE, type: "escalation", title: "On-call engineer paged", description: "The alert escalated to the on-call rotation and an incident channel opened." },
    { offset: base - 12 * MINUTE, type: "diagnosis", title: "Root cause identified", description: pattern.rootCause },
    { offset: base - 22 * MINUTE, type: "mitigation", title: "Mitigation applied", description: pattern.fixes[0]?.description ?? "The primary remediation was applied." },
    { offset: base - 32 * MINUTE, type: "resolution", title: "Service recovered", description: "Error rates returned to baseline and the incident was resolved." },
  ];
  return scaffold.map((e, i) => ({
    id: `${seed.ref}-evt-${i}`,
    timestamp: isoAgo(e.offset),
    title: e.title,
    description: e.description,
    type: e.type,
  }));
}

function buildAffected(seed: Seed, pattern: IncidentPattern): AffectedComponent[] {
  return pattern.affected.map((c, i) => ({
    id: `${seed.ref}-cmp-${i}`,
    name: c.name,
    type: c.type,
    health: c.health,
    impact: c.impact,
  }));
}

function buildFixes(seed: Seed, pattern: IncidentPattern): RecommendedFix[] {
  return pattern.fixes.map((f, i) => ({
    id: `${seed.ref}-fix-${i}`,
    title: f.title,
    description: f.description,
    effort: f.effort,
    priority: f.priority,
    codeSnippet: f.codeSnippet,
    language: f.language,
  }));
}

function buildSteps(seed: Seed, pattern: IncidentPattern): InvestigationStep[] {
  return pattern.steps.map((s, i) => ({
    id: `${seed.ref}-stp-${i}`,
    title: s,
    detail: i === 0 ? "Start here — this narrows the search space the fastest." : "Follow up once the previous step is confirmed.",
    completed: seed.status === "resolved" ? i < 2 : false,
  }));
}

function buildReport(seed: Seed, pattern: IncidentPattern): IncidentReport {
  return {
    id: `${seed.ref}-report`,
    executiveSummary: pattern.summary,
    severity: pattern.severity,
    rootCauseAnalysis: `${pattern.rootCause}\n\n${pattern.rootCauseExplanation}`,
    timeline: buildTimeline(seed, pattern),
    impactAnalysis: pattern.impact,
    affectedServices: buildAffected(seed, pattern),
    recommendedFixes: buildFixes(seed, pattern),
    nextInvestigationSteps: buildSteps(seed, pattern),
    lessonsLearned: pattern.lessons,
    generatedAt: isoAgo(seed.createdOffset - 24 * MINUTE),
    generatedBy: "DemandQ Analysis Engine (mock)",
  };
}

function buildIncident(seed: Seed, pattern: IncidentPattern): Incident {
  const hasReport = seed.status !== "analyzing" && seed.status !== "open";
  return {
    id: `${seed.ref}`.toLowerCase(),
    reference: seed.ref,
    title: pattern.title,
    status: seed.status,
    severity: pattern.severity,
    source: seed.source,
    service: serviceFor(pattern),
    createdAt: isoAgo(seed.createdOffset),
    updatedAt: isoAgo(Math.max(0, seed.createdOffset - 30 * MINUTE)),
    confidence: hasReport ? pattern.confidence : undefined,
    rootCause: hasReport ? pattern.rootCause : undefined,
    tags: pattern.tags,
    reportId: hasReport ? `${seed.ref}-report` : undefined,
    preview: pattern.summary,
  };
}

// ── Materialized dataset ────────────────────────────────────────────────────

export const MOCK_INCIDENTS: Incident[] = SEEDS.map((seed) => buildIncident(seed, patternById(seed.patternId)));

export const MOCK_REPORTS: IncidentReport[] = SEEDS.filter(
  (seed) => seed.status !== "analyzing" && seed.status !== "open",
).map((seed) => buildReport(seed, patternById(seed.patternId)));

export const MOCK_STATS: DashboardStats = {
  totalIncidents: 148,
  totalIncidentsDelta: 12,
  meanTimeToInsight: "2m 41s",
  meanTimeToInsightDelta: -34,
  activeIncidents: 3,
  resolvedRate: 96,
  resolvedRateDelta: 4,
  reportsGenerated: 132,
  reportsGeneratedDelta: 18,
};

export const MOCK_INCIDENT_TREND: TrendPoint[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 9 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 16 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 4 },
];

export const MOCK_SEVERITY_BREAKDOWN: { severity: string; count: number }[] = [
  { severity: "critical", count: 8 },
  { severity: "high", count: 24 },
  { severity: "medium", count: 61 },
  { severity: "low", count: 42 },
  { severity: "info", count: 13 },
];

/** A ready-to-paste example used by the analyzer empty state. */
export const SAMPLE_LOG = `2026-07-03T08:58:12.412Z ERROR [checkout-service] Failed to process order 8842
  at Pool.connect (/app/node_modules/pg-pool/index.js:45:11)
Error: timeout acquiring connection from pool (ECONNREFUSED)
  remaining connection slots are reserved for non-replication superuser connections
2026-07-03T08:58:12.902Z WARN  [api-gateway] upstream checkout-service returned 503 (2411 requests queued)
2026-07-03T08:58:13.104Z ERROR [checkout-service] PoolExhausted: 10/10 connections in use, 214 waiting`;
