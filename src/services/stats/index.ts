import type { DashboardStats, TrendPoint } from "@/types";
import { delay } from "@/lib/utils";
import { MOCK_STATS, MOCK_INCIDENT_TREND, MOCK_SEVERITY_BREAKDOWN } from "@/data/mock-data";

/** Dashboard analytics service over the mock aggregate metrics. */
export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(280);
    return MOCK_STATS;
  },

  async getIncidentTrend(): Promise<TrendPoint[]> {
    await delay(280);
    return MOCK_INCIDENT_TREND;
  },

  async getSeverityBreakdown(): Promise<{ severity: string; count: number }[]> {
    await delay(280);
    return MOCK_SEVERITY_BREAKDOWN;
  },
};
