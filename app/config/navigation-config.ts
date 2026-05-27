import {
  LayoutDashboard,
  SettingsIcon,
  Users2,
  LucideIcon,
} from "lucide-react";

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

export const SIDEBAR_CONFIG: Record<string, NavItem> = {
  dashboard: {
    name: "Dashboard",
    slug: "dashboard",
    permission: "read:dashboard",
    icon: LayoutDashboard,
    children: [],
  },
  user_management: {
    name: "User Management",
    slug: "user-management",
    permission: ["manage:user-management", "read:user-management"],
    icon: Users2,
    children: [
      {
        name: "Users",
        slug: "users",
        permission: [
          "manage:user-management.users",
          "read:user-management.users",
        ],
      },
      {
        name: "Roles & Permissions",
        slug: "roles-and-permissions",
        permission: [
          "manage:user-management.roles-and-permissions",
          "read:user-management.roles-and-permissions",
        ],
      },
    ],
  },
  system_settings: {
    name: "System Settings",
    slug: "system-settings",
    permission: ["manage:system-settings", "read:system-settings"],
    icon: SettingsIcon,
    children: [],
  },
};
