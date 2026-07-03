import {
  LayoutDashboard,
  ScanSearch,
  ListChecks,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional short description for command palette / tooltips. */
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: ROUTES.dashboard,
        icon: LayoutDashboard,
        description: "Fleet health, recent incidents and reports",
      },
    ],
  },
  {
    title: "Workflow",
    items: [
      {
        label: "Incident Analyzer",
        href: ROUTES.analyzer,
        icon: ScanSearch,
        description: "Paste logs and get an instant root-cause analysis",
      },
      {
        label: "Incident History",
        href: ROUTES.incidents,
        icon: ListChecks,
        description: "Every incident you've analyzed",
      },
      {
        label: "Reports",
        href: ROUTES.reports,
        icon: FileText,
        description: "Generated incident reports",
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        label: "Settings",
        href: ROUTES.settings,
        icon: Settings,
        description: "Preferences, integrations and analysis engine",
      },
    ],
  },
];

/** Flat list of nav items for search / command palette. */
export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
