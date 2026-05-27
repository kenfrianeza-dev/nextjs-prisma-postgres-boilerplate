import { LucideIcon } from "lucide-react";
import { NavCategory, NavItem, NavChild } from "@/app/config/navigation/navigation-constants";
import { SIDEBAR_CONFIG } from "@/app/config/navigation/navigation-config";
import { PermissionEngine } from "@/domain/shared/permission.engine";

// ---------------------------------------------------------------------------
// UI Output Types
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

export interface NavUICategory {
  label: string;
  items: NavUIItem[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function filterItem(
  navItem: NavItem,
  permissions: string[] | undefined
): NavUIItem | null {
  const authorizedChildren = navItem.children.filter((child: NavChild) =>
    permissions ? PermissionEngine.has(permissions, child.permission) : true
  );

  // A childless item (e.g. Dashboard) is shown based on its own permission.
  // An item with children is shown only when at least one child is accessible.
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
      (child: NavChild): NavUIChild => ({
        title: child.name,
        url: `/${navItem.slug}/${child.slug}`,
      })
    ),
  };
}

// ---------------------------------------------------------------------------
// Primary export: getAuthorizedSidebar
// ---------------------------------------------------------------------------

/**
 * Returns a filtered, permission-aware list of nav categories.
 * Categories with zero visible items after filtering are omitted entirely.
 *
 * @param config  - The full sidebar config (Record<string, NavCategory>)
 * @param permissions - The current user's permission strings, or undefined for no filtering
 */
export function getAuthorizedSidebar(
  config: Record<string, NavCategory>,
  permissions?: string[]
): NavUICategory[] {
  return Object.values(config)
    .map((category: NavCategory): NavUICategory | null => {
      const visibleItems = category.items
        .map((navItem: NavItem) => filterItem(navItem, permissions))
        .filter((item): item is NavUIItem => item !== null);

      if (visibleItems.length === 0) return null;

      return {
        label: category.label,
        items: visibleItems,
      };
    })
    .filter((cat): cat is NavUICategory => cat !== null);
}

// ---------------------------------------------------------------------------
// Convenience: full sidebar with no permission filtering
// ---------------------------------------------------------------------------

export function buildDefaultSidebar(): NavUICategory[] {
  return getAuthorizedSidebar(SIDEBAR_CONFIG);
}

// ---------------------------------------------------------------------------
// Utility: flatten all NavItems across categories for slug lookups
// ---------------------------------------------------------------------------

export function getAllNavItems(
  config: Record<string, NavCategory>
): NavItem[] {
  return Object.values(config).flatMap((category) => category.items);
}
