import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/shared/code-block";
import { PRIORITY_LABEL, EFFORT_LABEL } from "@/lib/constants";
import type { RecommendedFix } from "@/types";

const PRIORITY_TONE: Record<string, string> = {
  p0: "bg-severity-critical/10 text-severity-critical border-severity-critical/20",
  p1: "bg-severity-high/10 text-severity-high border-severity-high/20",
  p2: "bg-severity-medium/10 text-severity-medium border-severity-medium/20",
  p3: "bg-severity-info/10 text-severity-info border-severity-info/20",
};

interface RecommendedFixesProps {
  fixes: RecommendedFix[];
  className?: string;
}

/** Ordered, prioritized remediation list with optional code snippets. */
export function RecommendedFixes({ fixes, className }: RecommendedFixesProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {fixes.map((fix, index) => (
        <div key={fix.id} className="rounded-lg border border-border/60 bg-card/40 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-foreground">{fix.title}</h4>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      PRIORITY_TONE[fix.priority],
                    )}
                  >
                    {PRIORITY_LABEL[fix.priority]}
                  </span>
                  <Badge variant="muted">{EFFORT_LABEL[fix.effort]}</Badge>
                </div>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{fix.description}</p>
              {fix.codeSnippet && (
                <CodeBlock
                  className="mt-3"
                  code={fix.codeSnippet}
                  language={fix.language}
                  label={fix.language}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
