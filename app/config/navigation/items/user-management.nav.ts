import { Users2 } from "lucide-react";
import { NavItem } from "@/app/config/navigation/navigation-constants";

export const userManagementNav: NavItem = {
  name: "User Management",
  slug: "user-management",
  icon: Users2,
  permission: ["manage:user-management", "read:user-management"],
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
};
