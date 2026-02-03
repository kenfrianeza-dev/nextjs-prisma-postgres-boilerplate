import {
  LayoutDashboard,
  SettingsIcon,
  Users2,
  LucideIcon,
} from "lucide-react";

export interface ModuleChild {
  id: string;
  label: string;
  slug: string;
  permission?: string;
}

export interface Module {
  id: string;
  label: string;
  slug: string;
  icon: LucideIcon;
  permission?: string;
  children: ModuleChild[];
}

export const MODULES = {
  dashboard: {
    name: "Dashboard",
    blob: "dashboard",
    permission: "read:dashboard",
    icon: LayoutDashboard,
    children: [],
  },
  user_management: {
    name: "User Management",
    blob: "user-management",
    // permission: "read:user-management",
    icon: Users2,
    children: [
      {
        name: "Users",
        blob: "users",
        permission: "read:users",
      },
      {
        name: "Roles & Permissions",
        blob: "roles-and-permissions",
        permission: ["read:roles", "read:permissions"],
      },
    ],
  },
  system_settings: {
    name: "System Settings",
    blob: "system-settings",
    permission: "read:system-settings",
    icon: SettingsIcon,
    children: [],
  },
};
