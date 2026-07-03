import type { Severity } from "@/types";

/**
 * A rule-based knowledge base of common production incident signatures.
 *
 * The mock analysis engine matches raw input against these patterns to
 * produce a realistic, tailored root-cause analysis without an LLM. When a
 * real provider (OpenAI / Anthropic) is wired in, this same shape can be used
 * as few-shot context or removed entirely — the UI never depends on it.
 */
export interface IncidentPattern {
  id: string;
  /** Regexes / substrings that indicate this class of incident. */
  signals: RegExp[];
  category: string;
  severity: Severity;
  confidence: number;
  title: string;
  summary: string;
  rootCause: string;
  rootCauseExplanation: string;
  impact: string;
  affected: {
    name: string;
    type: "service" | "database" | "queue" | "cache" | "gateway" | "external" | "job";
    impact: string;
    health: "operational" | "degraded" | "partial_outage" | "major_outage";
  }[];
  fixes: {
    title: string;
    description: string;
    effort: "trivial" | "low" | "medium" | "high";
    priority: "p0" | "p1" | "p2" | "p3";
    codeSnippet?: string;
    language?: string;
  }[];
  steps: string[];
  lessons: string[];
  tags: string[];
}

export const INCIDENT_PATTERNS: IncidentPattern[] = [
  {
    id: "db-connection-pool",
    signals: [
      /ECONNREFUSED/i,
      /connection\s+pool/i,
      /too many connections/i,
      /timeout acquiring connection/i,
      /remaining connection slots/i,
      /PoolExhausted/i,
    ],
    category: "Database · Connectivity",
    severity: "critical",
    confidence: 92,
    title: "Database connection pool exhaustion",
    summary:
      "The primary database rejected new connections after the application's connection pool was saturated, causing cascading request failures across the API tier.",
    rootCause:
      "The connection pool was exhausted because connections were not being released back to the pool under sustained load, combined with a pool size set below peak concurrency.",
    rootCauseExplanation:
      "Under a traffic spike, request concurrency exceeded the configured pool ceiling. Long-running queries held connections longer than the acquisition timeout, so new requests queued and then timed out. Because the leaked connections were never returned, the pool never recovered on its own — every subsequent request failed fast with a connection-refused error until the service was restarted.",
    impact:
      "Approximately 38% of API requests returned 5xx errors for 22 minutes. Checkout and authentication flows were the most affected, with an estimated 4,100 failed user actions.",
    affected: [
      { name: "api-gateway", type: "gateway", impact: "Elevated 5xx rate, request queueing", health: "degraded" },
      { name: "postgres-primary", type: "database", impact: "Connection slots saturated", health: "partial_outage" },
      { name: "checkout-service", type: "service", impact: "Unable to persist orders", health: "major_outage" },
    ],
    fixes: [
      {
        title: "Increase pool size and enforce acquisition timeout",
        description:
          "Raise the pool maximum to align with observed peak concurrency and fail fast on acquisition so requests shed load instead of piling up.",
        effort: "low",
        priority: "p0",
        language: "typescript",
        codeSnippet:
          "const pool = new Pool({\n  max: 50,            // was 10 — below peak concurrency\n  connectionTimeoutMillis: 2_000,\n  idleTimeoutMillis: 30_000,\n});",
      },
      {
        title: "Guarantee connection release in a finally block",
        description:
          "Wrap every checkout in try/finally so a thrown query never leaks a connection back into the pool.",
        effort: "low",
        priority: "p0",
        language: "typescript",
        codeSnippet:
          "const client = await pool.connect();\ntry {\n  return await client.query(sql, params);\n} finally {\n  client.release();\n}",
      },
      {
        title: "Add pool saturation alerting",
        description:
          "Emit a metric for waiting-connection count and alert before the pool is fully saturated.",
        effort: "medium",
        priority: "p1",
      },
    ],
    steps: [
      "Confirm the pool max and current active/idle counts from the connection metrics dashboard.",
      "Search application logs for queries exceeding p99 latency during the incident window.",
      "Audit request handlers for code paths that acquire a connection without a guaranteed release.",
      "Load-test the fix against the observed peak concurrency before rolling out to production.",
    ],
    lessons: [
      "Connection pools must be sized against measured peak concurrency, not average load.",
      "Every acquired connection needs a guaranteed release path, enforced by finally blocks or a wrapper.",
      "Saturation should page before exhaustion — a leading indicator beats a lagging outage.",
    ],
    tags: ["database", "postgres", "connection-pool", "capacity"],
  },
  {
    id: "oom-kill",
    signals: [/OOMKilled/i, /OutOfMemoryError/i, /Killed process/i, /Cannot allocate memory/i, /heap out of memory/i, /memory limit/i],
    category: "Runtime · Memory",
    severity: "high",
    confidence: 88,
    title: "Out-of-memory termination of service pods",
    summary:
      "Service pods were OOMKilled by the container runtime after heap usage exceeded the configured memory limit, triggering repeated restarts and request loss during rollout.",
    rootCause:
      "A memory leak in the request-handling path caused heap usage to grow unbounded until each pod crossed its cgroup memory limit and was terminated by the kernel OOM killer.",
    rootCauseExplanation:
      "Objects were retained in a module-level cache that was never evicted, so resident set size grew linearly with traffic. Once a pod's working set crossed the container limit, the kernel killed it. Kubernetes rescheduled the pod, which warmed up, accumulated the same leak, and was killed again — producing a crash loop that reduced effective capacity and dropped in-flight requests on each restart.",
    impact:
      "Effective capacity dropped by roughly one third during the crash loop. Latency p99 tripled and a small percentage of requests were dropped mid-flight on each pod termination over a 35-minute window.",
    affected: [
      { name: "orders-worker", type: "service", impact: "Crash-looping, dropped in-flight work", health: "major_outage" },
      { name: "redis-cache", type: "cache", impact: "Thundering-herd on cache warmup", health: "degraded" },
    ],
    fixes: [
      {
        title: "Bound the in-memory cache with an eviction policy",
        description:
          "Replace the unbounded map with an LRU cache that has a hard entry ceiling and TTL so memory cannot grow without limit.",
        effort: "low",
        priority: "p0",
        language: "typescript",
        codeSnippet:
          "import { LRUCache } from 'lru-cache';\n\nconst cache = new LRUCache<string, Payload>({\n  max: 5_000,\n  ttl: 1000 * 60 * 5,\n});",
      },
      {
        title: "Right-size container memory requests and limits",
        description:
          "Set limits based on the measured steady-state working set plus headroom, and align requests to avoid noisy-neighbor eviction.",
        effort: "low",
        priority: "p1",
      },
      {
        title: "Add a heap-profile capture on restart",
        description:
          "Emit a heap snapshot when memory crosses a soft threshold so the leak can be diagnosed from production data.",
        effort: "medium",
        priority: "p2",
      },
    ],
    steps: [
      "Compare RSS growth curves across pod lifetimes to confirm a linear leak rather than a one-time spike.",
      "Capture and diff two heap snapshots taken minutes apart to find the growing retained set.",
      "Trace the retained objects back to the owning module and identify the missing eviction.",
      "Validate the fix by running a soak test and confirming RSS plateaus.",
    ],
    lessons: [
      "Any in-process cache must have a bounded size and eviction policy from day one.",
      "Container memory limits should be derived from measured working sets, not guesses.",
      "Crash-looping pods hide the root cause — capture diagnostics before the process dies.",
    ],
    tags: ["memory", "oom", "kubernetes", "leak"],
  },
  {
    id: "null-pointer",
    signals: [
      /NullPointerException/i,
      /Cannot read propert(y|ies) of (undefined|null)/i,
      /TypeError: .* is not a function/i,
      /undefined is not an object/i,
      /NoneType/i,
      /nil pointer dereference/i,
    ],
    category: "Application · Logic",
    severity: "medium",
    confidence: 90,
    title: "Unhandled null reference in request handler",
    summary:
      "A code path dereferenced a value that was null/undefined for a subset of requests, throwing an unhandled exception that returned 500s for the affected input shape.",
    rootCause:
      "An upstream response omitted an optional field the handler assumed was always present, and the missing null-check propagated an exception to the top-level handler.",
    rootCauseExplanation:
      "The handler assumed a nested field would always be populated, but a recent upstream change made it optional. For requests where the field was absent, the dereference threw, bypassing the normal response path and surfacing as a 500. Because only a specific input shape triggered it, the error rate was low but persistent and hard to reproduce without the exact payload.",
    impact:
      "A steady trickle of 500 errors (roughly 1.2% of requests to the affected endpoint) over several hours before detection. No data was corrupted; failed requests were retryable.",
    affected: [
      { name: "profile-service", type: "service", impact: "500s on a subset of payloads", health: "degraded" },
      { name: "identity-provider", type: "external", impact: "Optional field now omitted", health: "operational" },
    ],
    fixes: [
      {
        title: "Guard the optional field and provide a safe default",
        description:
          "Use optional chaining with an explicit fallback so the handler degrades gracefully instead of throwing.",
        effort: "trivial",
        priority: "p0",
        language: "typescript",
        codeSnippet:
          "// Before: throws when address is undefined\n// const city = user.profile.address.city;\n\nconst city = user.profile?.address?.city ?? 'Unknown';",
      },
      {
        title: "Validate upstream responses at the boundary",
        description:
          "Parse external responses through a schema so shape changes are caught explicitly rather than deep in business logic.",
        effort: "medium",
        priority: "p1",
        language: "typescript",
        codeSnippet:
          "const Profile = z.object({\n  address: z.object({ city: z.string() }).optional(),\n});\nconst profile = Profile.parse(response);",
      },
    ],
    steps: [
      "Group the exceptions by stack trace to confirm they share a single origin.",
      "Diff recent upstream API changes against the field the handler dereferences.",
      "Reproduce with a payload that omits the optional field.",
      "Add a regression test covering the missing-field case.",
    ],
    lessons: [
      "Treat every field from an external system as optional until proven otherwise.",
      "Schema validation at the boundary turns silent shape drift into a loud, early error.",
      "Low-rate 500s deserve alerting — they are often the leading edge of a larger regression.",
    ],
    tags: ["null-safety", "validation", "regression"],
  },
  {
    id: "rate-limit",
    signals: [/429/i, /rate limit/i, /too many requests/i, /quota exceeded/i, /throttl/i],
    category: "Integration · Rate limiting",
    severity: "high",
    confidence: 85,
    title: "Downstream rate limiting under retry storm",
    summary:
      "A third-party API began returning 429s, and an aggressive client retry policy amplified the load into a retry storm that prolonged the throttling window.",
    rootCause:
      "Retries without backoff or jitter multiplied request volume against a rate-limited dependency, keeping the service above the provider's quota and extending the outage.",
    rootCauseExplanation:
      "When the downstream provider started throttling, the client immediately retried failed calls. Without exponential backoff or jitter, retries synchronized and stacked on top of new traffic, pushing sustained volume far above the quota. The provider kept returning 429s, which triggered more retries — a self-reinforcing loop that only broke once traffic naturally subsided.",
    impact:
      "Feature calls depending on the provider failed for ~18 minutes. User-facing operations that could tolerate eventual consistency were queued; synchronous ones failed.",
    affected: [
      { name: "notifications-service", type: "service", impact: "Failing synchronous sends", health: "partial_outage" },
      { name: "email-provider", type: "external", impact: "Returning 429 Too Many Requests", health: "degraded" },
      { name: "retry-queue", type: "queue", impact: "Backlog growth from retries", health: "degraded" },
    ],
    fixes: [
      {
        title: "Add exponential backoff with full jitter",
        description:
          "Space out retries and randomize the delay so clients de-synchronize instead of hammering the dependency in lockstep.",
        effort: "low",
        priority: "p0",
        language: "typescript",
        codeSnippet:
          "const base = 200;\nconst delayMs = Math.random() * Math.min(30_000, base * 2 ** attempt);\nawait sleep(delayMs);",
      },
      {
        title: "Introduce a circuit breaker",
        description:
          "Trip a breaker after consecutive 429s to stop sending doomed requests and give the dependency time to recover.",
        effort: "medium",
        priority: "p1",
      },
      {
        title: "Respect the Retry-After header",
        description:
          "Honor the provider's Retry-After hint rather than using a fixed client-side schedule.",
        effort: "trivial",
        priority: "p1",
      },
    ],
    steps: [
      "Correlate the 429 onset with a traffic or deploy change on your side.",
      "Measure the retry amplification factor by comparing attempted vs. unique requests.",
      "Confirm the provider's documented quota and whether it was recently changed.",
      "Roll out backoff + jitter and verify the retry queue drains.",
    ],
    lessons: [
      "Retries without backoff and jitter turn a small hiccup into a self-inflicted outage.",
      "Circuit breakers protect both you and your dependencies during degradation.",
      "Always honor Retry-After — the provider is telling you exactly when to come back.",
    ],
    tags: ["rate-limiting", "retries", "resilience", "third-party"],
  },
  {
    id: "deploy-regression",
    signals: [/failed to compile/i, /module not found/i, /panic:/i, /segmentation fault/i, /exit code 1/i, /build failed/i, /deployment/i],
    category: "Release · Regression",
    severity: "high",
    confidence: 80,
    title: "Regression introduced by a recent deploy",
    summary:
      "Error rates rose sharply immediately following a deployment, pointing to a regression shipped in the release that changed runtime behavior for a subset of traffic.",
    rootCause:
      "A change in the latest release altered behavior in a code path that lacked test coverage, and the error surfaced only under production traffic patterns.",
    rootCauseExplanation:
      "The error-rate step change aligns exactly with the deploy marker, which strongly implicates the release. The offending change modified a shared code path but was validated only against the happy path in CI. Under real traffic — with edge-case inputs and concurrency the tests did not exercise — the new behavior failed, and the blast radius grew as the rollout completed.",
    impact:
      "Error rate stepped up at the deploy boundary and affected the rolled-out fraction of traffic until the release was rolled back.",
    affected: [
      { name: "web-frontend", type: "service", impact: "Elevated client errors post-deploy", health: "degraded" },
      { name: "ci-pipeline", type: "job", impact: "Gap in edge-case coverage", health: "operational" },
    ],
    fixes: [
      {
        title: "Roll back to the last known-good release",
        description:
          "Immediately revert to the previous build to stop the bleeding, then diagnose the regression off the critical path.",
        effort: "trivial",
        priority: "p0",
      },
      {
        title: "Add coverage for the failing scenario",
        description:
          "Write a test that reproduces the production failure before rolling forward, so the regression cannot recur.",
        effort: "medium",
        priority: "p1",
      },
      {
        title: "Adopt progressive delivery",
        description:
          "Ship behind a canary with automated rollback on error-rate regression to shrink blast radius on future releases.",
        effort: "high",
        priority: "p2",
      },
    ],
    steps: [
      "Overlay the error-rate graph with deploy markers to confirm the correlation.",
      "Diff the release against the previous build to isolate the suspect change.",
      "Reproduce locally or in staging with production-like inputs.",
      "Roll back, then roll forward with a targeted fix and new test coverage.",
    ],
    lessons: [
      "A deploy marker that lines up with an error spike is the fastest root-cause signal you have.",
      "Rollback first, diagnose second — recovery time beats a perfect diagnosis under fire.",
      "Canary releases with automatic rollback turn regressions into non-events.",
    ],
    tags: ["deploy", "regression", "rollback", "ci"],
  },
];

/** Fallback used when no specific pattern matches the input. */
export const GENERIC_PATTERN: IncidentPattern = {
  id: "generic",
  signals: [],
  category: "General · Uncategorized",
  severity: "medium",
  confidence: 68,
  title: "Unclassified production error",
  summary:
    "The input describes an error condition that could not be matched to a known signature. The analysis below is a best-effort reconstruction from the structure of the provided output.",
  rootCause:
    "A failure occurred in the request path, but the specific trigger could not be confidently classified from the provided input alone.",
  rootCauseExplanation:
    "The provided output indicates an error was raised and propagated, but it lacks a distinctive signature (such as a known exception class, exit code, or resource error) needed to pinpoint the mechanism. Additional context — surrounding log lines, the deploy timeline, and the request that triggered it — would raise confidence. The recommended steps below are designed to gather exactly that context.",
  impact:
    "Impact could not be precisely quantified from the input. Treat as user-affecting until proven otherwise and follow the investigation steps to scope the blast radius.",
  affected: [
    { name: "application-service", type: "service", impact: "Emitting errors of unknown scope", health: "degraded" },
  ],
  fixes: [
    {
      title: "Add structured, contextual logging around the failure",
      description:
        "Attach a request id, input shape, and stack context to error logs so the next occurrence is self-explanatory.",
      effort: "low",
      priority: "p1",
    },
    {
      title: "Reproduce with the exact triggering input",
      description:
        "Capture the request that produced the error and replay it against a non-production environment.",
      effort: "medium",
      priority: "p1",
    },
  ],
  steps: [
    "Collect the surrounding log lines (before and after) for the failing request.",
    "Check whether the error onset correlates with a recent deploy or config change.",
    "Identify the endpoint and input that triggers the failure and attempt a replay.",
    "Add instrumentation so a recurrence carries enough context to classify it.",
  ],
  lessons: [
    "Errors without context cost the most time — invest in structured logging before you need it.",
    "Correlating failures with deploys and config changes is the cheapest first diagnostic.",
  ],
  tags: ["uncategorized", "needs-context"],
};
