import { SettingsIcon } from "lucide-react";
import { NavItem } from "@/app/config/navigation/navigation-constants";

export const systemSettingsNav: NavItem = {
  name: "System Settings",
  slug: "system-settings",
  icon: SettingsIcon,
  permission: ["manage:system-settings", "read:system-settings"],
  children: [],
};
