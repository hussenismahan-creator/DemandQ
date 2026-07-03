"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, FileText } from "lucide-react";
import type { IncidentReport } from "@/types";
import { reportsService } from "@/services/reports";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ReportCard } from "./report-card";

/** Grid of generated reports with search, skeletons and an empty state. */
export function ReportsView() {
  const [reports, setReports] = useState<IncidentReport[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    reportsService.list().then((data) => {
      if (active) setReports(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!reports) return [];
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(
      (r) =>
        r.executiveSummary.toLowerCase().includes(q) ||
        r.affectedServices.some((s) => s.name.toLowerCase().includes(q)),
    );
  }, [reports, search]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports…"
          className="pl-9"
        />
      </div>

      {!reports ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="mt-4 h-5 w-20 rounded-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-2/3" />
              <Skeleton className="mt-4 h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description="Analyze an incident to generate your first professional incident report."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
