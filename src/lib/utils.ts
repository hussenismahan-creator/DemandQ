import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner used by every component. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Sleep helper used to simulate async latency in the mock services. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Deterministic-ish id generator (no external dependency required). */
export function createId(prefix = "id"): string {
  const random = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${random}`;
}

/** Format an ISO timestamp as a compact, human-friendly absolute date. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format an ISO timestamp with time down to the minute. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format an ISO timestamp as time only. */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Turn an ISO timestamp into a relative string like "3h ago". */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso).getTime();
  const now = Date.now();
  const diffSeconds = Math.round((now - date) / 1000);

  const ranges: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Infinity, "year"],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let previous = 1;
  for (const [limit, unit] of ranges) {
    if (Math.abs(diffSeconds) < limit) {
      const value = Math.round(diffSeconds / previous);
      return formatter.format(-value, unit);
    }
    previous = limit;
  }
  return formatDate(iso);
}

/** Clamp a number between a min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Compose a percentage delta into a display string with sign. */
export function formatDelta(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

/** Truncate a string to a max length, appending an ellipsis. */
export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}
