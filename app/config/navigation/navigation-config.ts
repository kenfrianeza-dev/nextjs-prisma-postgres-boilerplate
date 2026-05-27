import { NavCategory } from "@/app/config/navigation/navigation-constants";
import { dashboardNav } from "@/app/config/navigation/items/dashboard.nav";
import { userManagementNav } from "@/app/config/navigation/items/user-management.nav";
import { systemSettingsNav } from "@/app/config/navigation/items/system-settings.nav";

/**
 * SIDEBAR_CONFIG is the central aggregator.
 * Each key is a logical category that groups related nav items.
 * To add a new section, create a *.nav.ts item file and add it here.
 */
export const SIDEBAR_CONFIG: Record<string, NavCategory> = {
  main: {
    label: "Overview",
    items: [dashboardNav],
  },
  administration: {
    label: "Administration",
    items: [userManagementNav, systemSettingsNav],
  },
};
