"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "2m 41s", label: "Mean time to insight" },
  { value: "96%", label: "Incidents resolved" },
  { value: "8", label: "Report sections generated" },
  { value: "0", label: "Dashboards to wire up" },
];

/** A compact metrics band between sections. */
export function StatsBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 md:grid-cols-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="bg-card px-6 py-8 text-center"
          >
            <p className="text-3xl font-semibold tracking-tight text-gradient-brand">{stat.value}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
