"use client";

import Link from "next/link";
import { Bell, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { SearchCommand } from "./search-command";

interface TopbarProps {
  onOpenMenu: () => void;
}

/** Sticky application top bar: mobile menu, search, quick actions. */
export function Topbar({ onOpenMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMenu}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center">
        <SearchCommand />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-severity-critical" />
        </Button>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href={ROUTES.analyzer}>
            <Plus className="h-4 w-4" />
            New analysis
          </Link>
        </Button>
      </div>
    </header>
  );
}
