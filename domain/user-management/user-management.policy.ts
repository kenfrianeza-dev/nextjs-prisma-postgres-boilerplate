export const UserManagementPolicy = {
  /**
   * Check if a user can view users.
   */
  canViewUsers(permissions: string[]) {
    return permissions.includes("read:users") || permissions.includes("*:*");
  },

  /**
   * Check if a user can view roles.
   */
  canViewRoles(permissions: string[]) {
    return permissions.includes("read:roles") || permissions.includes("*:*");
  },

  /**
   * Check if a user can view permissions.
   */
  canViewPermissions(permissions: string[]) {
    return permissions.includes("read:permissions") || permissions.includes("*:*");
  },

  /**
   * Check if a user can manage (create/update/delete) users.
   */
  canManageUsers(permissions: string[]) {
    return permissions.includes("manage:users") || permissions.includes("delete:users") || permissions.includes("update:users") || permissions.includes("create:users") || permissions.includes("*:*");
  },

  /**
   * Check if a user can update a specific user.
   */
  canUpdateUser(permissions: string[]) {
    return permissions.includes("update:users") || permissions.includes("manage:users") || permissions.includes("*:*");
  },

  /**
   * Check if a user can delete a specific user.
   */
  canDeleteUser(permissions: string[]) {
    return permissions.includes("delete:users") || permissions.includes("manage:users") || permissions.includes("*:*");
  },

  /**
   * Check if a user can create users.
   */
  canCreateUser(permissions: string[]) {
    return permissions.includes("create:users") || permissions.includes("manage:users") || permissions.includes("*:*");
  },
};
