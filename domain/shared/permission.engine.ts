export const PermissionEngine = {
  has(permissions: string[], perm?: string) {
    if (!perm) return true;
    if (permissions.includes("*:*")) return true;
    if (permissions.includes(perm)) return true;

    return permissions.some(p => {
      if (p.includes("*")) {
        const pattern = p.replace("*", "");
        return perm.startsWith(pattern);
      }
      
      // Hierarchical check: if p is a parent of perm (e.g., read:system-settings matches read:system-settings.org)
      return perm.startsWith(p + ".");
    });
  },

  any(permissions: string[], perms: string[]) {
    return perms.some(p => this.has(permissions, p));
  },

  manageOrAction(permissions: string[], resource: string, action: string) {
    return this.any(permissions, [
      `${action}:${resource}`,
      `manage:${resource}`,
      "*:*",
    ]);
  },
};
