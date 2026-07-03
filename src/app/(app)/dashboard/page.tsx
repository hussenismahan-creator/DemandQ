import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Fleet health, recent incidents and generated reports at a glance.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your incident intelligence at a glance."
        actions={
          <Button asChild size="sm">
            <Link href={ROUTES.analyzer}>
              <Sparkles className="h-4 w-4" />
              Analyze incident
            </Link>
          </Button>
        }
      />
      <DashboardView />
    </div>
  );
}
