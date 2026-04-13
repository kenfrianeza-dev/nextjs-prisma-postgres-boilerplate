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
  permission?: string | string[];
}

export interface Module {
  id: string;
  label: string;
  slug: string;
  icon: LucideIcon;
  permission?: string | string[];
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
    permission: ["manage:user-management", "read:user-management"],
    icon: Users2,
    children: [
      {
        name: "Users",
        blob: "users",
        permission: [
          "manage:user-management.users",
          "read:user-management.users",
        ],
      },
      {
        name: "Roles & Permissions",
        blob: "roles-and-permissions",
        permission: [
          "manage:user-management.roles-and-permissions",
          "read:user-management.roles-and-permissions",
        ],
      },
    ],
  },
  system_settings: {
    name: "System Settings",
    blob: "system-settings",
    permission: ["manage:system-settings", "read:system-settings"],
    icon: SettingsIcon,
    children: [],
  },
};
