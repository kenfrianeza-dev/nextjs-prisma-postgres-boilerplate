export const PermissionEngine = {
  has(permissions: string[], perm?: string) {
    if (!perm) return true;
    if (permissions.includes("*:*")) return true;
    if (permissions.includes(perm)) return true;

    return permissions.some(p => {
      if (!p.includes("*")) return false;
      const pattern = p.replace("*", "");
      return perm.startsWith(pattern);
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
