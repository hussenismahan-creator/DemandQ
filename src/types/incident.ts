/**
 * Core domain types for DemandQ's incident intelligence workflow.
 * These are the single source of truth shared across the UI and the
 * (currently mocked) analysis service layer.
 */

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type IncidentStatus =
  | "open"
  | "analyzing"
  | "analyzed"
  | "investigating"
  | "resolved";

export type InputSource =
  | "logs"
  | "stack_trace"
  | "terminal"
  | "error_message"
  | "file_upload";

export type ServiceHealth = "operational" | "degraded" | "partial_outage" | "major_outage";

/** A single event on the reconstructed incident timeline. */
export interface TimelineEvent {
  id: string;
  timestamp: string; // ISO string
  title: string;
  description: string;
  type: "detection" | "escalation" | "diagnosis" | "mitigation" | "resolution" | "note";
}

/** A component/service implicated by the analysis. */
export interface AffectedComponent {
  id: string;
  name: string;
  type: "service" | "database" | "queue" | "cache" | "gateway" | "external" | "job";
  health: ServiceHealth;
  impact: string;
}

/** A recommended remediation action produced by the analysis. */
export interface RecommendedFix {
  id: string;
  title: string;
  description: string;
  effort: "trivial" | "low" | "medium" | "high";
  priority: "p0" | "p1" | "p2" | "p3";
  codeSnippet?: string;
  language?: string;
}

/** A concrete next step an on-call engineer should take. */
export interface InvestigationStep {
  id: string;
  title: string;
  detail: string;
  completed: boolean;
}

/** The structured, sectioned incident report. */
export interface IncidentReport {
  id: string;
  executiveSummary: string;
  severity: Severity;
  rootCauseAnalysis: string;
  timeline: TimelineEvent[];
  impactAnalysis: string;
  affectedServices: AffectedComponent[];
  recommendedFixes: RecommendedFix[];
  nextInvestigationSteps: InvestigationStep[];
  lessonsLearned: string[];
  generatedAt: string;
  generatedBy: string;
}

/** The machine-readable result of analyzing an incident's raw input. */
export interface AnalysisResult {
  id: string;
  summary: string;
  severity: Severity;
  /** 0–100 confidence in the identified root cause. */
  confidence: number;
  rootCause: string;
  rootCauseExplanation: string;
  category: string;
  timeline: TimelineEvent[];
  affectedComponents: AffectedComponent[];
  recommendedFixes: RecommendedFix[];
  investigationSteps: InvestigationStep[];
  tags: string[];
  report: IncidentReport;
}

/** A persisted incident record. */
export interface Incident {
  id: string;
  reference: string; // e.g. "INC-1042"
  title: string;
  status: IncidentStatus;
  severity: Severity;
  source: InputSource;
  service: string;
  createdAt: string;
  updatedAt: string;
  confidence?: number;
  rootCause?: string;
  tags: string[];
  reportId?: string;
  preview: string;
}

/** Raw input submitted to the analyzer. */
export interface AnalysisInput {
  content: string;
  source: InputSource;
  service?: string;
  fileName?: string;
}

/** Aggregate metrics surfaced on the dashboard. */
export interface DashboardStats {
  totalIncidents: number;
  totalIncidentsDelta: number;
  meanTimeToInsight: string;
  meanTimeToInsightDelta: number;
  activeIncidents: number;
  resolvedRate: number;
  resolvedRateDelta: number;
  reportsGenerated: number;
  reportsGeneratedDelta: number;
}

/** A point on a sparkline/trend chart. */
export interface TrendPoint {
  label: string;
  value: number;
}
