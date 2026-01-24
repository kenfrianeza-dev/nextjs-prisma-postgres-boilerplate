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
        name: "Permissions",
        blob: "permissions",
        permission: "read:permissions",
      },
      {
        name: "Roles",
        blob: "roles",
        permission: "read:roles",
      },
    ],
  },
  system_settings: {
    name: "System Settings",
    blob: "system-settings",
    permission: "read:system-settings",
    icon: SettingsIcon,
    children: [
      // {
      //   name: "General",
      //   blob: "general",
      //   permission: "read:system-settings.general",
      // },
      // {
      //   name: "Appearance",
      //   blob: "appearance",
      //   permission: "read:system-settings.appearance",
      // },
    ],
  },
};
