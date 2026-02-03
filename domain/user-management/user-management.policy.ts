import { PermissionEngine as P } from "@/domain/shared/permission.engine";

export const UserManagementPolicy = {
  viewUsers: (p: string[]) => P.has(p, "read:users"),
  viewRoles: (p: string[]) => P.has(p, "read:roles-and-permissions"),
  viewPermissions: (p: string[]) => P.has(p, "read:roles-and-permissions"),

  createUser: (p: string[]) => P.manageOrAction(p, "users", "create"),
  updateUser: (p: string[]) => P.manageOrAction(p, "users", "update"),
  deleteUser: (p: string[]) => P.manageOrAction(p, "users", "delete"),

  createRole: (p: string[]) => P.manageOrAction(p, "roles-and-permissions", "create"),
  updateRole: (p: string[]) => P.manageOrAction(p, "roles-and-permissions", "update"),
  deleteRole: (p: string[]) => P.manageOrAction(p, "roles-and-permissions", "delete"),
};
