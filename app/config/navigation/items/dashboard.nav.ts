import { LayoutDashboard } from "lucide-react";
import { NavItem } from "@/app/config/navigation/navigation-constants";

export const dashboardNav: NavItem = {
  name: "Dashboard",
  slug: "dashboard",
  icon: LayoutDashboard,
  permission: "read:dashboard",
  children: [],
};
