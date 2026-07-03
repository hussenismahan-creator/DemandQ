import Link from "next/link";
import { FileText, ArrowUpRight, Wrench, Boxes } from "lucide-react";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";
import type { IncidentReport } from "@/types";
import { ROUTES } from "@/lib/constants";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Card } from "@/components/ui/card";

interface ReportCardProps {
  report: IncidentReport;
  className?: string;
}

/** Preview card for a generated incident report. */
export function ReportCard({ report, className }: ReportCardProps) {
  return (
    <Link href={`${ROUTES.reports}/${report.id}`} className={cn("group block", className)}>
      <Card className="flex h-full flex-col p-5 transition-all hover:border-border hover:shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.3)]">
        <div className="flex items-start justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground">
            <FileText className="h-4 w-4" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </div>

        <div className="mt-4 flex-1">
          <SeverityBadge severity={report.severity} />
          <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">
            {truncate(report.executiveSummary, 96)}
          </h3>
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Boxes className="h-3.5 w-3.5" />
            {report.affectedServices.length} services
          </span>
          <span className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            {report.recommendedFixes.length} fixes
          </span>
          <span className="ml-auto">{formatRelativeTime(report.generatedAt)}</span>
        </div>
      </Card>
    </Link>
  );
}
