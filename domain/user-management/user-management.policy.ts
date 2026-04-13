import { PermissionEngine as P } from "@/domain/shared/permission.engine";

export const UserManagementPolicy = {
  viewUsers: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.users", "read:user-management.users"]),
  viewRoles: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.roles-and-permissions", "read:user-management.roles-and-permissions"]),
  viewPermissions: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.roles-and-permissions", "read:user-management.roles-and-permissions"]),

  createUser: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.users", "create:user-management.users"]),
  updateUser: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.users", "update:user-management.users"]),
  deleteUser: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.users", "delete:user-management.users"]),

  createRole: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.roles-and-permissions", "create:user-management.roles-and-permissions"]),
  updateRole: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.roles-and-permissions", "update:user-management.roles-and-permissions"]),
  deleteRole: (permissions: string[]) => P.hasAny(permissions, ["manage:user-management.roles-and-permissions", "delete:user-management.roles-and-permissions"]),
};
