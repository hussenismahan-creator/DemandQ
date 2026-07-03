"use client";

import { useState } from "react";
import { User, Bell, Cpu, Plug, Check } from "lucide-react";
import { toast } from "sonner";
import { activeProviderName } from "@/services/analysis";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/incident/section-card";

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", description: "Post analyses and reports to a channel", connected: true },
  { id: "pagerduty", name: "PagerDuty", description: "Import incidents from your on-call rotations", connected: true },
  { id: "github", name: "GitHub", description: "Link fixes to pull requests and commits", connected: false },
  { id: "datadog", name: "Datadog", description: "Pull correlated logs and metrics", connected: false },
];

/** Settings surface: profile, preferences, analysis engine and integrations. */
export function SettingsView() {
  const [name, setName] = useState("Mahad Osman");
  const [email, setEmail] = useState("mahad@arbetsklivet.se");
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    criticalOnly: false,
    weeklyDigest: true,
    autoReport: true,
  });
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)),
    );
    const target = integrations.find((i) => i.id === id);
    toast.success(`${target?.name} ${target?.connected ? "disconnected" : "connected"}`);
  }

  return (
    <div className="space-y-5">
      {/* Profile */}
      <SectionCard icon={User} title="Profile" description="How you appear across DemandQ">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={() => toast.success("Profile saved")}>
            <Check className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon={Bell} title="Notifications" description="Choose what you're alerted about">
        <div className="divide-y divide-border/60">
          {[
            { key: "emailAlerts" as const, label: "Email alerts", desc: "Receive an email when an analysis completes" },
            { key: "criticalOnly" as const, label: "Critical only", desc: "Only notify me for critical-severity incidents" },
            { key: "weeklyDigest" as const, label: "Weekly digest", desc: "A Monday summary of incident trends" },
            { key: "autoReport" as const, label: "Auto-generate reports", desc: "Draft a report automatically after each analysis" },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.desc}</p>
              </div>
              <Switch
                checked={prefs[row.key]}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, [row.key]: v }))}
                aria-label={row.label}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Analysis engine */}
      <SectionCard icon={Cpu} title="Analysis Engine" description="The backend powering incident analysis">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Active provider</p>
              <Badge variant="muted" className="uppercase">
                {activeProviderName}
              </Badge>
            </div>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              Currently running the built-in mock engine. Set{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">NEXT_PUBLIC_ANALYSIS_PROVIDER=llm</code>{" "}
              and implement the LLM provider to switch to OpenAI or Anthropic — no UI changes required.
            </p>
          </div>
          <Badge variant="success">Operational</Badge>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <Label htmlFor="apikey">Model API key</Label>
          <Input id="apikey" type="password" placeholder="sk-… (stored server-side when LLM provider is enabled)" disabled />
          <p className="text-xs text-muted-foreground">
            Keys are never used in the browser. Wire the provider in a server route before enabling.
          </p>
        </div>
      </SectionCard>

      {/* Integrations */}
      <SectionCard icon={Plug} title="Integrations" description="Connect the tools your team already uses">
        <div className="grid gap-3 sm:grid-cols-2">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{integration.name}</p>
                  {integration.connected && <Badge variant="success">Connected</Badge>}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{integration.description}</p>
              </div>
              <Button
                variant={integration.connected ? "outline" : "default"}
                size="sm"
                onClick={() => toggleIntegration(integration.id)}
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
