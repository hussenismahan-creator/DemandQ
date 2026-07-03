import type { Metadata } from "next";
import { IncidentDetail } from "@/components/incidents/incident-detail";
import { MOCK_INCIDENTS } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Incident",
  description: "Incident detail and generated report.",
};

// Pre-render a static page for every seeded incident (required for static export).
export function generateStaticParams() {
  return MOCK_INCIDENTS.map((incident) => ({ id: incident.id }));
}

// Required for static export: only pre-generated ids get a standalone page.
export const dynamicParams = false;

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IncidentDetail id={id} />;
}
