import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";
import { SystemStatus } from "./system-status";

interface SidebarProps {
  onNavigate?: () => void;
}

/** Full sidebar contents, shared by the desktop rail and the mobile drawer. */
export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-card/30">
      <div className="flex h-14 items-center border-b border-border/60 px-5">
        <Logo />
      </div>

      <SidebarNav onNavigate={onNavigate} />

      <div className="space-y-3 border-t border-border/60 p-3">
        <Button asChild size="sm" className="w-full">
          <Link href={ROUTES.analyzer} onClick={onNavigate}>
            <Sparkles className="h-4 w-4" />
            Analyze incident
          </Link>
        </Button>
        <SystemStatus />
        <UserMenu />
      </div>
    </div>
  );
}
