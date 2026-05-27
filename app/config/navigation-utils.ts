import { SIDEBAR_CONFIG, NavItem } from "@/app/config/navigation-config";
import { PermissionEngine } from "@/domain/shared/permission.engine";
import { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Return types
// ---------------------------------------------------------------------------

export interface NavUIChild {
  title: string;
  url: string;
}

export interface NavUIItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items: NavUIChild[];
}

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

export function mapSidebarToNavItems(
  config: Record<string, NavItem>,
  permissions?: string[]
): NavUIItem[] {
  return Object.values(config)
    .map((navItem: NavItem): NavUIItem | null => {
      // Filter children the user is permitted to see
      const authorizedChildren = navItem.children.filter(
        (child) =>
          permissions
            ? PermissionEngine.has(permissions, child.permission)
            : true
      );

      // A nav item with no children is shown if the user has its own permission.
      // A nav item with children is shown only when at least one child is accessible.
      const isItemAccessible = permissions
        ? PermissionEngine.has(permissions, navItem.permission)
        : true;

      const hasVisibleChildren =
        navItem.children.length > 0 && authorizedChildren.length > 0;

      const shouldShow =
        navItem.children.length === 0 ? isItemAccessible : hasVisibleChildren;

      if (!shouldShow) return null;

      return {
        title: navItem.name,
        url: `/${navItem.slug}`,
        icon: navItem.icon,
        items: authorizedChildren.map(
          (child): NavUIChild => ({
            title: child.name,
            url: `/${navItem.slug}/${child.slug}`,
          })
        ),
      };
    })
    .filter((item): item is NavUIItem => item !== null);
}

// ---------------------------------------------------------------------------
// Convenience overload — pass nothing to get the full (no-permission-filter) list
// ---------------------------------------------------------------------------

export function buildDefaultNavItems(): NavUIItem[] {
  return mapSidebarToNavItems(SIDEBAR_CONFIG);
}
