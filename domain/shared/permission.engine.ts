
/**
 * PermissionEngine is a utility object that provides methods for checking permissions.
 * It supports exact matches, wildcard matches (*), and hierarchical permission checks.
 */
export const PermissionEngine = {
  /**
   * The core logic engine that determines if a specific permission is granted.
   * It evaluates permissions in the following order:
   * 1. Empty Check: If no perm is provided, returns true.
   * 2. Superuser Check: Checks for '*:*' global access.
   * 3. Exact Match: Checks if the string exists in the list.
   * 4. Wildcard Match: Handles patterns like 'users:*' (matches 'users:create').
   * 5. Hierarchical Match: Supports dot-notation inheritance (e.g., 'read:settings' matches 'read:settings.org').
   * 
   * @example
   * 1. Specific Feature Flag: Check for a unique granular action
   * PermissionEngine.has(userPerms, 'export:report.financial')
   * 
   * 2. Wildcard Support: Matches 'users:create' if user has 'users:*'
   * PermissionEngine.has(userPerms, 'users:create')
   * 
   * 3. Hierarchical Access: 'read:settings' automatically grants 'read:settings.branding'
   * PermissionEngine.has(userPerms, 'read:settings.branding')
   * 
   * @param permissions Array of user permissions.
   * @param perm Optional permission or array of permissions to check. If not provided, returns true.
   * @returns True if the user has the permission, false otherwise.
   */
  has(permissions: string[], perm?: string | string[]): boolean {
    if (!perm) return true;

    // Handle array of permissions by delegating to hasAny
    if (Array.isArray(perm)) {
      return this.hasAny(permissions, perm);
    }

    if (typeof perm !== "string") return false;

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

  
  /**
   * A utility wrapper around 'has' that checks if the user satisfies at least one 
   * requirement from a list of possibilities. Useful for actions that can be 
   * authorized by multiple different roles or permissions.
   * 
   * @example
   * 1. Alternative Roles: Check if user is either an 'admin' or 'auditor'
   * PermissionEngine.hasAny(userPerms, ['read:all', 'audit:system'])
   * 
   * 2. Multiple Conditions: Allow viewing if they have any of these related perms
   * PermissionEngine.hasAny(userPerms, ['view:profile', 'manage:users', 'view:public_data'])
   * 
   * 3. Legacy Support: Check for both old and new permission names during a migration
   * PermissionEngine.hasAny(userPerms, ['old_view_perm', 'new:view:resource'])
   * 
   * @param permissions Array of user permissions.
   * @param perms Array of permissions to check.
   * @returns True if the user has any of the permissions, false otherwise.
   */
  hasAny(permissions: string[], perms: string[]) {
    return perms.some(p => this.has(permissions, p));
  },

  /**
   * A specialized helper for the standard Resource:Action pattern.
   * It checks for authorization in this order:
   * 1. Specific action: 'action:resource' (e.g., 'update:users')
   * 2. Management: 'manage:resource' (e.g., 'manage:users')
   * 3. Global superuser: '*:*'
   * 
   * It assumes that a manager of a resource has the right to perform any 
   * specific action on it.
   * 
   * @example
   * 1. Standard CRUD: Allow 'update' if they have 'update:users' OR 'manage:users'
   * PermissionEngine.manageOrAction(userPerms, 'users', 'update')
   * 
   * 2. Configuration: 'view:settings' or 'manage:settings'
   * PermissionEngine.manageOrAction(userPerms, 'settings', 'view')
   * 
   * 3. Superuser: Automatically returns true if user has '*:*'
   * PermissionEngine.manageOrAction(userPerms, 'any_resource', 'any_action')
   * 
   * @param permissions Array of user permissions.
   * @param resource Resource to check.
   * @param action Action to check.
   * @returns True if the user has the manage or action permission, false otherwise.
   */
  manageOrAction(permissions: string[], resource: string, action: string) {
    return this.hasAny(permissions, [
      `${action}:${resource}`,
      `manage:${resource}`,
      "*:*",
    ]);
  },
};
