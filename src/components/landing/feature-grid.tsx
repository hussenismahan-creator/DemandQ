"use client";

import { motion } from "framer-motion";
import {
  Microscope,
  Clock,
  FileText,
  GaugeCircle,
  Boxes,
  Wrench,
  ShieldCheck,
  GitBranch,
} from "lucide-react";

const FEATURES = [
  { icon: Microscope, title: "Root cause, not guesswork", body: "Pinpoints the most likely cause and explains the mechanism behind the failure." },
  { icon: GaugeCircle, title: "Confidence scoring", body: "Every diagnosis carries a calibrated confidence score so you know how much to trust it." },
  { icon: Clock, title: "Reconstructed timelines", body: "Turns raw output into an ordered sequence — detection, escalation, mitigation, recovery." },
  { icon: Boxes, title: "Blast-radius mapping", body: "Identifies which services, databases and queues were implicated and how." },
  { icon: Wrench, title: "Actionable fixes", body: "Prioritized remediation with ready-to-paste code, ranked by effort and urgency." },
  { icon: FileText, title: "Professional reports", body: "A complete, shareable incident report generated automatically for every analysis." },
  { icon: GitBranch, title: "Investigation steps", body: "A concrete checklist that narrows the search space the fastest, in the right order." },
  { icon: ShieldCheck, title: "Lessons learned", body: "Distills each incident into durable takeaways so the same failure doesn't recur." },
];

/** The core capability grid. */
export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need to resolve faster
        </h2>
        <p className="mt-3 text-muted-foreground">
          DemandQ turns unstructured incident data into a clear, actionable picture — the moment you paste it.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
              className="group rounded-xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-border hover:bg-card/70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
