"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

/** Final call-to-action band. */
export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card to-card/40 px-6 py-16 text-center"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 opacity-40 blur-[100px]" />
          <div className="absolute inset-0 bg-grid mask-radial-faded opacity-30" />
        </div>

        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Stop staring at logs. Start understanding incidents.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Paste your next incident into DemandQ and get a root cause, fixes and a report before your coffee cools.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href={ROUTES.analyzer}>
              <Sparkles className="h-4 w-4" />
              Analyze an incident
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={ROUTES.dashboard}>
              Explore the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
