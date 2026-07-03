import type { Incident, AnalysisResult, AnalysisInput } from "@/types";
import { delay, createId } from "@/lib/utils";
import { MOCK_INCIDENTS } from "@/data/mock-data";
import { SOURCE_META } from "@/lib/constants";
import { deriveIncidentTitle } from "@/services/analysis/mock-engine";

/**
 * Incident repository. Backed by the in-memory mock dataset today; the method
 * surface mirrors what a real API/database client would expose, so swapping in
 * a fetch-based implementation later is a drop-in change.
 */

// A mutable copy so newly-analyzed incidents can be appended within a session.
let store: Incident[] = [...MOCK_INCIDENTS];

export interface IncidentQuery {
  search?: string;
  status?: string;
  severity?: string;
}

export const incidentsService = {
  async list(query: IncidentQuery = {}): Promise<Incident[]> {
    await delay(300);
    let results = [...store].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );

    if (query.status && query.status !== "all") {
      results = results.filter((i) => i.status === query.status);
    }
    if (query.severity && query.severity !== "all") {
      results = results.filter((i) => i.severity === query.severity);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      results = results.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.reference.toLowerCase().includes(q) ||
          i.service.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return results;
  },

  async recent(limit = 5): Promise<Incident[]> {
    await delay(250);
    return [...store]
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, limit);
  },

  async getById(id: string): Promise<Incident | null> {
    await delay(200);
    return store.find((i) => i.id === id || i.reference.toLowerCase() === id.toLowerCase()) ?? null;
  },

  /** Persist a freshly-analyzed incident derived from an analysis result. */
  async createFromAnalysis(input: AnalysisInput, result: AnalysisResult): Promise<Incident> {
    const nextNumber = 1043 + store.length - MOCK_INCIDENTS.length;
    const reference = `INC-${nextNumber}`;
    const incident: Incident = {
      id: createId("inc"),
      reference,
      title: deriveIncidentTitle(result),
      status: "analyzed",
      severity: result.severity,
      source: input.source,
      service: input.service || result.affectedComponents[0]?.name || "application-service",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confidence: result.confidence,
      rootCause: result.rootCause,
      tags: result.tags,
      reportId: result.report.id,
      preview: result.summary,
    };
    store = [incident, ...store];
    return incident;
  },

  sourceLabel(source: Incident["source"]): string {
    return SOURCE_META[source]?.label ?? source;
  },
};
