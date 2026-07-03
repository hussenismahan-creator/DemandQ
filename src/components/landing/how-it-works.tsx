"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, ScanSearch, FileCheck2 } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardPaste,
    step: "01",
    title: "Paste your incident",
    body: "Drop in logs, a stack trace, terminal output or an error message — or upload a log file.",
  },
  {
    icon: ScanSearch,
    step: "02",
    title: "AI analyzes it",
    body: "DemandQ parses the signals, correlates events across services and diagnoses the root cause.",
  },
  {
    icon: FileCheck2,
    step: "03",
    title: "Get a full report",
    body: "Receive a root-cause analysis, prioritized fixes and a professional incident report to share.",
  },
];

/** Three-step "how it works" section. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border/40 bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From raw logs to resolution in three steps
          </h2>
        </div>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-card text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground/60">{item.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
