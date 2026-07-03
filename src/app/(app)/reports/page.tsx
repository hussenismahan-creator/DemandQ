import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ReportsView } from "@/components/reports/reports-view";

export const metadata: Metadata = {
  title: "Reports",
  description: "Professional incident reports generated from your analyses.",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Professional, shareable incident reports generated from your analyses."
      />
      <ReportsView />
    </div>
  );
}
