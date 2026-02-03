import { PermissionEngine as P } from "@/domain/shared/permission.engine";

export const UserManagementPolicy = {
  viewUsers: (p: string[]) => P.has(p, "read:users"),
  viewRoles: (p: string[]) => P.has(p, "read:roles"),
  viewPermissions: (p: string[]) => P.has(p, "read:permissions"),

  createUser: (p: string[]) => P.manageOrAction(p, "users", "create"),
  updateUser: (p: string[]) => P.manageOrAction(p, "users", "update"),
  deleteUser: (p: string[]) => P.manageOrAction(p, "users", "delete"),

  createRole: (p: string[]) => P.manageOrAction(p, "roles", "create"),
  updateRole: (p: string[]) => P.manageOrAction(p, "roles", "update"),
  deleteRole: (p: string[]) => P.manageOrAction(p, "roles", "delete"),
};
