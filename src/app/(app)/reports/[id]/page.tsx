import type { Metadata } from "next";
import { ReportDetail } from "@/components/reports/report-detail";
import { MOCK_REPORTS } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Report",
  description: "A generated incident report.",
};

// Pre-render a static page for every seeded report (required for static export).
export function generateStaticParams() {
  return MOCK_REPORTS.map((report) => ({ id: report.id }));
}

export const dynamicParams = false;

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportDetail id={id} />;
}
