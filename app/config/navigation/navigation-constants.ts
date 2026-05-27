import { LucideIcon } from "lucide-react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

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

// ---------------------------------------------------------------------------
// Static App Shell Data (teams, user placeholder, etc.)
// ---------------------------------------------------------------------------

export const NAVIGATIONS = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "My App 1",
      logo: GalleryVerticalEnd,
      plan: "Option 1",
    },
    {
      name: "My App 2",
      logo: AudioWaveform,
      plan: "Option 2",
    },
    {
      name: "My App 3",
      logo: Command,
      plan: "Option 3",
    },
  ],
};
