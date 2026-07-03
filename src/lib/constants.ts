import type { Severity, IncidentStatus, ServiceHealth, InputSource } from "@/types";

/** Product-level metadata used across the app shell and metadata tags. */
export const APP = {
  name: "DemandQ",
  tagline: "AI-powered Incident Intelligence",
  description:
    "Understand production incidents faster. Paste logs, stack traces or terminal output and get an instant root-cause analysis and a professional incident report.",
  version: "0.1.0",
  url: "https://demandq.app",
} as const;

/** Navigation routes rendered in the app sidebar. */
export const ROUTES = {
  landing: "/",
  dashboard: "/dashboard",
  analyzer: "/analyzer",
  incidents: "/incidents",
  reports: "/reports",
  settings: "/settings",
} as const;

interface SeverityMeta {
  label: string;
  /** Tailwind text color token. */
  text: string;
  /** Tailwind background token for badges. */
  badge: string;
  /** Dot/indicator background. */
  dot: string;
  /** Solid ring/border accent. */
  ring: string;
  order: number;
}

export const SEVERITY_META: Record<Severity, SeverityMeta> = {
  critical: {
    label: "Critical",
    text: "text-severity-critical",
    badge: "bg-severity-critical/10 text-severity-critical border-severity-critical/20",
    dot: "bg-severity-critical",
    ring: "ring-severity-critical/30",
    order: 0,
  },
  high: {
    label: "High",
    text: "text-severity-high",
    badge: "bg-severity-high/10 text-severity-high border-severity-high/20",
    dot: "bg-severity-high",
    ring: "ring-severity-high/30",
    order: 1,
  },
  medium: {
    label: "Medium",
    text: "text-severity-medium",
    badge: "bg-severity-medium/10 text-severity-medium border-severity-medium/20",
    dot: "bg-severity-medium",
    ring: "ring-severity-medium/30",
    order: 2,
  },
  low: {
    label: "Low",
    text: "text-severity-low",
    badge: "bg-severity-low/10 text-severity-low border-severity-low/20",
    dot: "bg-severity-low",
    ring: "ring-severity-low/30",
    order: 3,
  },
  info: {
    label: "Info",
    text: "text-severity-info",
    badge: "bg-severity-info/10 text-severity-info border-severity-info/20",
    dot: "bg-severity-info",
    ring: "ring-severity-info/30",
    order: 4,
  },
};

interface StatusMeta {
  label: string;
  badge: string;
  dot: string;
}

export const STATUS_META: Record<IncidentStatus, StatusMeta> = {
  open: {
    label: "Open",
    badge: "bg-severity-info/10 text-severity-info border-severity-info/20",
    dot: "bg-severity-info",
  },
  analyzing: {
    label: "Analyzing",
    badge: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  analyzed: {
    label: "Analyzed",
    badge: "bg-severity-low/10 text-severity-low border-severity-low/20",
    dot: "bg-severity-low",
  },
  investigating: {
    label: "Investigating",
    badge: "bg-warning/10 text-warning border-warning/20",
    dot: "bg-warning",
  },
  resolved: {
    label: "Resolved",
    badge: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
};

interface HealthMeta {
  label: string;
  text: string;
  dot: string;
}

export const HEALTH_META: Record<ServiceHealth, HealthMeta> = {
  operational: { label: "Operational", text: "text-success", dot: "bg-success" },
  degraded: { label: "Degraded", text: "text-warning", dot: "bg-warning" },
  partial_outage: { label: "Partial outage", text: "text-severity-high", dot: "bg-severity-high" },
  major_outage: { label: "Major outage", text: "text-severity-critical", dot: "bg-severity-critical" },
};

export const SOURCE_META: Record<InputSource, { label: string }> = {
  logs: { label: "Logs" },
  stack_trace: { label: "Stack trace" },
  terminal: { label: "Terminal output" },
  error_message: { label: "Error message" },
  file_upload: { label: "Uploaded file" },
};

export const PRIORITY_LABEL: Record<string, string> = {
  p0: "P0 · Now",
  p1: "P1 · Urgent",
  p2: "P2 · Soon",
  p3: "P3 · Backlog",
};

export const EFFORT_LABEL: Record<string, string> = {
  trivial: "Trivial",
  low: "Low effort",
  medium: "Medium effort",
  high: "High effort",
};
