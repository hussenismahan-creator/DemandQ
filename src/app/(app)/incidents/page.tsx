import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { IncidentsView } from "@/components/incidents/incidents-view";

export const metadata: Metadata = {
  title: "Incident History",
  description: "Every incident you've analyzed with DemandQ.",
};

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident History"
        description="Every incident you've analyzed, searchable and filterable."
        actions={
          <Button asChild size="sm">
            <Link href={ROUTES.analyzer}>
              <Sparkles className="h-4 w-4" />
              Analyze incident
            </Link>
          </Button>
        }
      />
      <IncidentsView />
    </div>
  );
}
