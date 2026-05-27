import { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Navigation Type Definitions
// ---------------------------------------------------------------------------

export interface NavChild {
  name: string;
  slug: string;
  permission?: string | string[];
}

export interface NavItem {
  name: string;
  slug: string;
  icon: LucideIcon;
  permission?: string | string[];
  children: NavChild[];
}

export interface NavCategory {
  label: string;
  items: NavItem[];
}

