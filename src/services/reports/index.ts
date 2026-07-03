import type { IncidentReport } from "@/types";
import { delay } from "@/lib/utils";
import { MOCK_REPORTS } from "@/data/mock-data";

/**
 * Report repository. Mirrors the incidents service shape. New reports produced
 * by an analysis are registered here so the Reports pages can render them.
 */

let store: IncidentReport[] = [...MOCK_REPORTS];

export const reportsService = {
  async list(): Promise<IncidentReport[]> {
    await delay(300);
    return [...store].sort((a, b) => Date.parse(b.generatedAt) - Date.parse(a.generatedAt));
  },

  async recent(limit = 4): Promise<IncidentReport[]> {
    await delay(250);
    return [...store]
      .sort((a, b) => Date.parse(b.generatedAt) - Date.parse(a.generatedAt))
      .slice(0, limit);
  },

  async getById(id: string): Promise<IncidentReport | null> {
    await delay(200);
    return store.find((r) => r.id === id) ?? null;
  },

  register(report: IncidentReport): void {
    if (!store.some((r) => r.id === report.id)) {
      store = [report, ...store];
    }
  },
};
