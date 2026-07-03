"use client";

import { motion } from "framer-motion";
import { Microscope, Clock, Boxes, Wrench, ListTodo, FileText, ScanSearch } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionCard } from "@/components/incident/section-card";
import { Timeline } from "@/components/incident/timeline";
import { AffectedComponents } from "@/components/incident/affected-components";
import { RecommendedFixes } from "@/components/incident/recommended-fixes";
import { InvestigationSteps } from "@/components/incident/investigation-steps";
import { ReportDocument } from "@/components/incident/report-document";
import { ResultHero } from "./result-hero";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

/** The complete analyzer results view: hero + findings tabs + generated report. */
export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  return (
    <div className="space-y-5">
      <ResultHero result={result} onReset={onReset} />

      <Tabs defaultValue="analysis">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="analysis" className="flex-1 sm:flex-none">
            <ScanSearch className="h-3.5 w-3.5" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="report" className="flex-1 sm:flex-none">
            <FileText className="h-3.5 w-3.5" />
            Incident Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-5 focus-visible:outline-none">
          <motion.div {...fade} transition={{ delay: 0.05 }}>
            <SectionCard icon={Microscope} title="Root Cause" description={`${Math.round(result.confidence)}% confidence`}>
              <p className="text-sm font-medium leading-relaxed text-foreground">{result.rootCause}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {result.rootCauseExplanation}
              </p>
            </SectionCard>
          </motion.div>

          <motion.div {...fade} transition={{ delay: 0.1 }}>
            <SectionCard icon={Clock} title="Timeline" description="Reconstructed sequence of events">
              <Timeline events={result.timeline} />
            </SectionCard>
          </motion.div>

          <motion.div {...fade} transition={{ delay: 0.15 }}>
            <SectionCard
              icon={Boxes}
              title="Affected Components"
              description={`${result.affectedComponents.length} implicated`}
            >
              <AffectedComponents components={result.affectedComponents} />
            </SectionCard>
          </motion.div>

          <motion.div {...fade} transition={{ delay: 0.2 }}>
            <SectionCard icon={Wrench} title="Recommended Fixes" description="Prioritized remediation">
              <RecommendedFixes fixes={result.recommendedFixes} />
            </SectionCard>
          </motion.div>

          <motion.div {...fade} transition={{ delay: 0.25 }}>
            <SectionCard icon={ListTodo} title="Investigation Steps">
              <InvestigationSteps steps={result.investigationSteps} />
            </SectionCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="report" className="focus-visible:outline-none">
          <ReportDocument report={result.report} showHeader title={result.summary.split(".")[0]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
