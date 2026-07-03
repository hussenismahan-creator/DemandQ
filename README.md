# DemandQ — AI-powered Incident Intelligence

> Understand production incidents faster. Paste logs, stack traces or terminal
> output and get an instant root-cause analysis and a professional incident
> report.

DemandQ is a production-quality MVP that turns unstructured incident data into a
clear, actionable picture: **root cause → why it happened → prioritized fixes →
a complete, shareable incident report.**

The analysis is powered today by a local, rule-based engine (no LLM, no API
keys, fully offline) behind a clean provider interface — so wiring in OpenAI or
Anthropic later is a drop-in change with **zero UI changes**.

---

## ✨ Features

- **Incident Analyzer** — a large code editor for logs, stack traces, terminal
  output and error messages, with file upload, a sample loader, and streamed
  loading states.
- **Root-cause analysis** — the most likely cause, a mechanism-level
  explanation, and a calibrated confidence score.
- **Reconstructed timeline** — detection → escalation → diagnosis → mitigation →
  resolution.
- **Blast-radius mapping** — the services, databases and queues implicated.
- **Prioritized fixes** — ranked by effort and urgency, with copy-ready code.
- **Investigation checklist** — the fastest path to confirmation.
- **Generated incident report** — nine sections, exportable and printable.
- **Dashboard** — stats, trends, severity distribution, recent incidents & reports.
- **History & Reports** — searchable, filterable archives.
- **Command palette** (`⌘K`), responsive layout, accessible components, dark theme.

## 🧱 Tech stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | Next.js 15 (App Router) + React 19       |
| Language       | TypeScript (strict)                      |
| Styling        | Tailwind CSS + CSS variables             |
| Components     | shadcn/ui (Radix primitives)             |
| Animation      | Framer Motion                            |
| Icons          | Lucide                                   |
| Toasts         | Sonner                                   |

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the app
open http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit (strict)
```

## 🗂️ Project structure

```
src/
├── app/                        # App Router
│   ├── (app)/                  # Authenticated product shell (sidebar + topbar)
│   │   ├── dashboard/
│   │   ├── analyzer/
│   │   ├── incidents/[id]/
│   │   ├── reports/[id]/
│   │   └── settings/
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout (fonts, providers, metadata)
│   └── globals.css             # Design tokens & base styles
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/                 # App shell: sidebar, topbar, command palette
│   ├── shared/                 # Cross-cutting presentational components
│   ├── incident/               # Reusable incident/report sections
│   ├── analyzer/               # Analyzer input, loading & results
│   ├── dashboard/              # Dashboard widgets
│   ├── incidents/              # History list & detail
│   ├── reports/                # Report list & detail
│   ├── settings/               # Settings surface
│   └── landing/                # Marketing sections
├── services/                   # ← the integration seam
│   ├── analysis/               # Provider interface + mock engine + LLM stub
│   ├── incidents/              # Incident repository
│   ├── reports/                # Report repository
│   └── stats/                  # Dashboard analytics
├── data/                       # Deterministic mock dataset
├── hooks/                      # useAnalysis (analyzer state machine)
├── lib/                        # utils, constants, design tokens
└── types/                      # Domain types (single source of truth)
```

## 🧠 Architecture

DemandQ follows a clean, layered architecture:

```
UI (pages & components)
      │  depends only on ↓
Hooks (useAnalysis)
      │  depends only on ↓
Services (analyzeIncident, repositories)   ← swap the backend here
      │  implemented by ↓
Providers (MockAnalysisProvider | LlmAnalysisProvider)
```

- **The UI never imports a concrete provider.** It calls
  `analyzeIncident(input)` and consumes an `AnalysisResult`. That's the entire
  contract.
- **Types are the single source of truth** (`src/types`). Both the mock engine
  and any future LLM implementation must produce the same shapes.
- **No duplicated content.** Incident/report sections (timeline, affected
  components, fixes, steps) are componentized once and reused by the analyzer
  results, the incident detail page and the report view.

### Wiring in a real LLM (OpenAI / Anthropic)

Everything is already in place. To go live:

1. Implement `LlmAnalysisProvider.analyze()` in
   `src/services/analysis/llm.provider.ts` (a fully documented stub).
2. Do the model call **server-side** (a Route Handler or Server Action) so the
   API key never reaches the browser. Ask the model to return JSON matching
   `AnalysisResult`, ideally via tool/function calling or structured outputs,
   and validate it (e.g. with zod).
3. Set `NEXT_PUBLIC_ANALYSIS_PROVIDER=llm`.

No component changes are required — the factory in
`src/services/analysis/index.ts` selects the provider.

## ♿ Accessibility & UX

- Semantic landmarks, `aria-*` labels, focus-visible rings and keyboard support
  (including the `⌘K` command palette).
- Respects colour-contrast in the dark theme via HSL design tokens.
- Skeleton loaders, animated empty states and streamed progress throughout.

## 📌 Notes

- All data is mock and lives in-memory; incidents you analyze during a session
  appear across History and Reports but reset on reload.
- Timestamps in the seed dataset are anchored to a fixed instant to guarantee
  deterministic, hydration-safe rendering.

---

Built with Next.js, TypeScript and Tailwind — designed to feel like software
Datadog, Linear or Vercel could have shipped.
