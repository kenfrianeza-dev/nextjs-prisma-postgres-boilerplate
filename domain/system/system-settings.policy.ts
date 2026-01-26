export const SystemSettingsPolicy = {
  /**
   * Check if a user can view system settings.
   */
  canView(permissions: string[]) {
    return permissions.includes("read:system-settings") || permissions.includes("*:*");
  },

  /**
   * Check if a user can update system settings.
   */
  canUpdate(permissions: string[]) {
    return permissions.includes("update:system-settings") || permissions.includes("*:*");
  },

  /**
   * Check if a user can view a specific category.
   */
  canViewCategory(permissions: string[], slug: string) {
    return permissions.includes(`read:system-settings.${slug}`) || permissions.includes("*:*") || permissions.includes("read:system-settings");
  }
};
