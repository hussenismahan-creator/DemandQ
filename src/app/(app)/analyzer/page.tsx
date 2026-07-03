import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AnalyzerPanel } from "@/components/analyzer/analyzer-panel";

export const metadata: Metadata = {
  title: "Incident Analyzer",
  description: "Paste logs, stack traces or terminal output for an instant root-cause analysis.",
};

export default function AnalyzerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Analyzer"
        description="Paste logs, a stack trace or terminal output and let DemandQ find the root cause."
      />
      <AnalyzerPanel />
    </div>
  );
}
