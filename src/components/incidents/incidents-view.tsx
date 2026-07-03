"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ListChecks, SlidersHorizontal } from "lucide-react";
import type { Incident, IncidentStatus, Severity } from "@/types";
import { incidentsService } from "@/services/incidents";
import { STATUS_META, SEVERITY_META } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { IncidentListItem } from "./incident-list-item";

/** Incident history with client-side search + status/severity filters. */
export function IncidentsView() {
  const [incidents, setIncidents] = useState<Incident[] | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");

  useEffect(() => {
    let active = true;
    incidentsService.list().then((data) => {
      if (active) setIncidents(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!incidents) return [];
    const q = search.trim().toLowerCase();
    return incidents.filter((incident) => {
      if (status !== "all" && incident.status !== status) return false;
      if (severity !== "all" && incident.severity !== severity) return false;
      if (!q) return true;
      return (
        incident.title.toLowerCase().includes(q) ||
        incident.reference.toLowerCase().includes(q) ||
        incident.service.toLowerCase().includes(q) ||
        incident.tags.some((tag) => tag.includes(q))
      );
    });
  }, [incidents, search, status, severity]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, reference, service or tag…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(Object.keys(STATUS_META) as IncidentStatus[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {STATUS_META[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              {(Object.keys(SEVERITY_META) as Severity[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SEVERITY_META[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      {!incidents ? (
        <Card className="divide-y divide-border/60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No incidents match your filters"
          description="Try adjusting your search or clearing the status and severity filters."
        />
      ) : (
        <Card className="p-2">
          <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
            <span>{filtered.length} incidents</span>
          </div>
          <div>
            {filtered.map((incident) => (
              <IncidentListItem key={incident.id} incident={incident} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
