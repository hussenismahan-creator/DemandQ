import type { Metadata } from "next";
import { IncidentDetail } from "@/components/incidents/incident-detail";

export const metadata: Metadata = {
  title: "Incident",
  description: "Incident detail and generated report.",
};

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IncidentDetail id={id} />;
}
