"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Clock, Server, FileText, Loader2 } from "lucide-react";
import type { Incident, IncidentReport } from "@/types";
import { incidentsService } from "@/services/incidents";
import { reportsService } from "@/services/reports";
import { ROUTES, SOURCE_META } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfidenceMeter } from "@/components/shared/confidence-meter";
import { EmptyState } from "@/components/shared/empty-state";
import { ReportDocument } from "@/components/incident/report-document";

interface IncidentDetailProps {
  id: string;
}

/** Full incident detail: metadata header + generated report (if available). */
export function IncidentDetail({ id }: IncidentDetailProps) {
  const [incident, setIncident] = useState<Incident | null | undefined>(undefined);
  const [report, setReport] = useState<IncidentReport | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const found = await incidentsService.getById(id);
      if (!active) return;
      setIncident(found);
      if (found?.reportId) {
        const rep = await reportsService.getById(found.reportId);
        if (active) setReport(rep);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (incident === undefined) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-40" />
        <Card className="p-6">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/2" />
        </Card>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (incident === null) {
    return (
      <EmptyState
        icon={FileText}
        title="Incident not found"
        description="We couldn't find that incident. It may have been removed."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.incidents}>Back to history</Link>
          </Button>
        }
      />
    );
  }

  const metaRows = [
    { icon: Server, label: "Service", value: incident.service },
    { icon: FileText, label: "Source", value: SOURCE_META[incident.source].label },
    { icon: Clock, label: "Detected", value: formatDateTime(incident.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.incidents}>
            <ArrowLeft className="h-4 w-4" />
            Incident history
          </Link>
        </Button>
        <span className="font-mono text-xs text-muted-foreground">{incident.reference}</span>
      </div>

      {/* Header card */}
      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{incident.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{incident.preview}</p>

            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              {metaRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground/70">{row.label}</dt>
                      <dd className={cn("text-sm font-medium text-foreground", row.label === "Service" && "font-mono")}>
                        {row.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>

          {typeof incident.confidence === "number" && (
            <div className="flex shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card/60 p-5 lg:w-52">
              <ConfidenceMeter value={incident.confidence} size={116} />
            </div>
          )}
        </div>
      </Card>

      {/* Report or pending state */}
      {report ? (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Generated incident report</h2>
          </div>
          <ReportDocument report={report} />
        </div>
      ) : incident.status === "analyzing" ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">Analysis in progress</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            This incident is still being analyzed. The report will appear here once complete.
          </p>
        </Card>
      ) : (
        <EmptyState
          icon={Sparkles}
          title="No report generated yet"
          description="Run this incident through the analyzer to generate a full report."
          action={
            <Button asChild size="sm">
              <Link href={ROUTES.analyzer}>
                <Sparkles className="h-4 w-4" />
                Analyze now
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
