"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer, FileText } from "lucide-react";
import { toast } from "sonner";
import type { IncidentReport } from "@/types";
import { reportsService } from "@/services/reports";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ReportDocument } from "@/components/incident/report-document";

interface ReportDetailProps {
  id: string;
}

/** Renders a single generated report with export/print affordances. */
export function ReportDetail({ id }: ReportDetailProps) {
  const [report, setReport] = useState<IncidentReport | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    reportsService.getById(id).then((data) => {
      if (active) setReport(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  function exportJson() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported", { description: `${report.id}.json` });
  }

  if (report === undefined) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (report === null) {
    return (
      <EmptyState
        icon={FileText}
        title="Report not found"
        description="We couldn't find that report. It may have been removed."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTES.reports}>Back to reports</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.reports}>
            <ArrowLeft className="h-4 w-4" />
            All reports
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
          <Button size="sm" onClick={exportJson}>
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </Button>
        </div>
      </div>

      <ReportDocument report={report} showHeader />
    </div>
  );
}
