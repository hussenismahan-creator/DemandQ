import { AppShell } from "@/components/layout/app-shell";

/** Layout for all authenticated product pages — wraps them in the app shell. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
