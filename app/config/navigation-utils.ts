import { MODULES } from "@/app/config/modules-constants";

import { hasPermission } from "@/lib/permissions";

export function mapModulesToNavItems(
  modules: typeof MODULES,
  permissions?: string[]
) {
  return Object.values(modules)
    .map((module: any) => {
      // Filter children first
      const authorizedChildren = module.children.filter((child: any) =>
        permissions ? hasPermission(permissions, child.permission) : true
      );

      // Check if module itself has a permission requirement (if any)
      // For now, if it has children, we show it if at least one child is accessible.
      // If it has no children (like Dashboard), we check its own permission if present.

      const isModuleAccessible = permissions
        ? hasPermission(permissions, module.permission)
        : true;

      // Special case: If module has children, it's visible if it has at least one authorized child.
      // If it has NO children config (like dashboard), it relies on isModuleAccessible.
      const hasVisibleChildren =
        module.children.length > 0 && authorizedChildren.length > 0;
      const shouldShowModule =
        module.children.length === 0 ? isModuleAccessible : hasVisibleChildren;

      if (!shouldShowModule) return null;

      return {
        title: module.name,
        url: `/${module.blob}`,
        icon: module.icon,
        items: authorizedChildren.map((child: any) => ({
          title: child.name,
          url: `/${module.blob}/${child.blob}`,
        })),
      };
    })
    .filter(Boolean) as any[]; // cast to any[] to match expected return type easily or let inference work
}
