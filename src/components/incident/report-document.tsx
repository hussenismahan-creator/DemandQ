import {
  FileText,
  Gauge,
  Microscope,
  Clock,
  Activity,
  Boxes,
  Wrench,
  ListTodo,
  GraduationCap,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import type { IncidentReport } from "@/types";
import { SEVERITY_META } from "@/lib/constants";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { SectionCard } from "./section-card";
import { Timeline } from "./timeline";
import { AffectedComponents } from "./affected-components";
import { RecommendedFixes } from "./recommended-fixes";
import { InvestigationSteps } from "./investigation-steps";

interface ReportDocumentProps {
  report: IncidentReport;
  className?: string;
  /** Renders a document header (title + metadata). Off inside the analyzer. */
  showHeader?: boolean;
  title?: string;
  reference?: string;
}

/** Renders the complete, sectioned incident report. Reused across pages. */
export function ReportDocument({
  report,
  className,
  showHeader = false,
  title,
  reference,
}: ReportDocumentProps) {
  const severityMeta = SEVERITY_META[report.severity];

  return (
    <div className={cn("space-y-5", className)}>
      {showHeader && (
        <div className="rounded-xl border border-border/60 bg-gradient-to-b from-card to-card/40 p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {reference && <span className="font-mono">{reference}</span>}
            <span>·</span>
            <span>Generated {formatDateTime(report.generatedAt)}</span>
            <span>·</span>
            <span>{report.generatedBy}</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {title ?? "Incident Report"}
          </h2>
          <div className="mt-3">
            <SeverityBadge severity={report.severity} />
          </div>
        </div>
      )}

      {/* Executive summary */}
      <SectionCard icon={FileText} title="Executive Summary">
        <p className="text-sm leading-relaxed text-muted-foreground">{report.executiveSummary}</p>
      </SectionCard>

      {/* Severity + impact side by side on wide screens */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard icon={Gauge} title="Incident Severity">
          <div className="flex items-center gap-4">
            <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl border", severityMeta.badge)}>
              <span className={cn("text-lg font-bold", severityMeta.text)}>
                {severityMeta.label[0]}
              </span>
            </div>
            <div>
              <p className={cn("text-lg font-semibold", severityMeta.text)}>{severityMeta.label}</p>
              <p className="text-sm text-muted-foreground">
                Classified from the observed blast radius and error characteristics.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Activity} title="Impact Analysis">
          <p className="text-sm leading-relaxed text-muted-foreground">{report.impactAnalysis}</p>
        </SectionCard>
      </div>

      {/* Root cause */}
      <SectionCard icon={Microscope} title="Root Cause Analysis">
        <div className="space-y-3">
          {report.rootCauseAnalysis.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className={cn(
                "text-sm leading-relaxed",
                i === 0 ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </SectionCard>

      {/* Timeline */}
      <SectionCard icon={Clock} title="Timeline" description="Reconstructed sequence of events">
        <Timeline events={report.timeline} />
      </SectionCard>

      {/* Affected services */}
      <SectionCard icon={Boxes} title="Affected Services" description={`${report.affectedServices.length} components`}>
        <AffectedComponents components={report.affectedServices} />
      </SectionCard>

      {/* Recommended fixes */}
      <SectionCard icon={Wrench} title="Recommended Fixes" description="Prioritized remediation">
        <RecommendedFixes fixes={report.recommendedFixes} />
      </SectionCard>

      {/* Investigation steps */}
      <SectionCard icon={ListTodo} title="Next Investigation Steps">
        <InvestigationSteps steps={report.nextInvestigationSteps} />
      </SectionCard>

      {/* Lessons learned */}
      <SectionCard icon={GraduationCap} title="Lessons Learned">
        <ul className="space-y-2.5">
          {report.lessonsLearned.map((lesson, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {lesson}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
