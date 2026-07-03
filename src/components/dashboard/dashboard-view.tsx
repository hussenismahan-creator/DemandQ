"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Timer, Activity, FileCheck2, ArrowRight, TrendingUp, PieChart } from "lucide-react";
import type { DashboardStats, TrendPoint, Incident, IncidentReport } from "@/types";
import { statsService } from "@/services/stats";
import { incidentsService } from "@/services/incidents";
import { reportsService } from "@/services/reports";
import { ROUTES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "./stat-card";
import { IncidentTrendChart } from "./incident-trend-chart";
import { SeverityBreakdown } from "./severity-breakdown";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { IncidentListItem } from "@/components/incidents/incident-list-item";
import { ReportCard } from "@/components/reports/report-card";

interface DashboardData {
  stats: DashboardStats;
  trend: TrendPoint[];
  severity: { severity: string; count: number }[];
  incidents: Incident[];
  reports: IncidentReport[];
}

/** Client dashboard: loads all widgets in parallel, shows a skeleton meanwhile. */
export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      statsService.getDashboardStats(),
      statsService.getIncidentTrend(),
      statsService.getSeverityBreakdown(),
      incidentsService.recent(5),
      reportsService.recent(4),
    ]).then(([stats, trend, severity, incidents, reports]) => {
      if (active) setData({ stats, trend, severity, incidents, reports });
    });
    return () => {
      active = false;
    };
  }, []);

  if (!data) return <DashboardSkeleton />;

  const { stats, trend, severity, incidents, reports } = data;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Total incidents" value={stats.totalIncidents} delta={stats.totalIncidentsDelta} icon={AlertTriangle} />
        <StatCard index={1} label="Mean time to insight" value={0} displayValue={stats.meanTimeToInsight} delta={stats.meanTimeToInsightDelta} invertDelta icon={Timer} />
        <StatCard index={2} label="Active incidents" value={stats.activeIncidents} icon={Activity} />
        <StatCard index={3} label="Reports generated" value={stats.reportsGenerated} delta={stats.reportsGeneratedDelta} icon={FileCheck2} />
      </div>

      {/* Trend + severity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Incidents this week</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </CardHeader>
          <CardContent>
            <IncidentTrendChart data={trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <PieChart className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">Severity distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SeverityBreakdown data={severity} />
          </CardContent>
        </Card>
      </div>

      {/* Recent incidents + reports */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Recent incidents</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.incidents}>
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="-mx-3">
              {incidents.map((incident) => (
                <IncidentListItem key={incident.id} incident={incident} compact />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Recent reports</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.reports}>
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
