"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_NAV_ITEMS } from "./nav-config";
import { MOCK_INCIDENTS } from "@/data/mock-data";
import { ROUTES } from "@/lib/constants";
import { SeverityBadge } from "@/components/shared/severity-badge";

interface Command {
  id: string;
  label: string;
  hint?: string;
  href: string;
  group: "Navigation" | "Incidents";
  keywords: string;
  severity?: (typeof MOCK_INCIDENTS)[number]["severity"];
}

function buildCommands(): Command[] {
  const nav: Command[] = ALL_NAV_ITEMS.map((item) => ({
    id: `nav-${item.href}`,
    label: item.label,
    hint: item.description,
    href: item.href,
    group: "Navigation",
    keywords: `${item.label} ${item.description ?? ""}`.toLowerCase(),
  }));

  const incidents: Command[] = MOCK_INCIDENTS.slice(0, 6).map((incident) => ({
    id: `inc-${incident.id}`,
    label: incident.title,
    hint: incident.reference,
    href: `${ROUTES.incidents}/${incident.id}`,
    group: "Incidents",
    keywords: `${incident.reference} ${incident.title} ${incident.service}`.toLowerCase(),
    severity: incident.severity,
  }));

  return [...nav, ...incidents];
}

/** ⌘K / Ctrl+K command palette used from the topbar search trigger. */
export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const commands = useMemo(buildCommands, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.keywords.includes(q));
  }, [commands, query]);

  const grouped = useMemo(() => {
    return {
      Navigation: filtered.filter((c) => c.group === "Navigation"),
      Incidents: filtered.filter((c) => c.group === "Incidents"),
    };
  }, [filtered]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-9 w-full items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/40 sm:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border/60 bg-popover shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-border/60 px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search incidents, reports and pages…"
                  className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[52vh] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No results for “{query}”.
                  </p>
                )}
                {(["Navigation", "Incidents"] as const).map((group) =>
                  grouped[group].length > 0 ? (
                    <div key={group} className="mb-1">
                      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        {group}
                      </p>
                      {grouped[group].map((command) => (
                        <button
                          key={command.id}
                          onClick={() => go(command.href)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                          )}
                        >
                          {command.group === "Incidents" ? (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <CornerDownLeft className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="flex-1 truncate text-foreground">{command.label}</span>
                          {command.severity && <SeverityBadge severity={command.severity} withDot={false} />}
                          {command.hint && !command.severity && (
                            <span className="truncate text-xs text-muted-foreground">{command.hint}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : null,
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
