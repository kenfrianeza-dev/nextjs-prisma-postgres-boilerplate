/**
 * Shared types for the Users module.
 * Centralised here to follow the DRY principle — every component,
 * store, hook, and column definition imports from this single source.
 */

// ─── Domain Models ───────────────────────────────────────────

export type UserWithRoles = {
  id: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffixName: string | null;
  phoneNumber: string;
  isActive: boolean;
  roles: {
    role: {
      id: string;
      name: string;
    };
  }[];
  permissions: {
    id: string;
    userId: string;
    permissionId: string;
    permission: {
      id: string;
      action: string;
      resource: string;
      module: string | null;
      description: string | null;
    };
  }[];
};

export type RoleOption = {
  id: string;
  name: string;
};

export type PermissionOption = {
  id: string;
  action: string;
  resource: string;
  module: string | null;
  description: string | null;
};

export type RoleWithPermissions = {
  id: string;
  name: string;
  permissions: {
    permission: {
      id: string;
    };
  }[];
};

// ─── Component Props ─────────────────────────────────────────

export interface UsersClientProps {
  users: UserWithRoles[];
  roles: RoleOption[];
  permissions: string[];
  allPermissions: PermissionOption[];
  rolesWithPermissions: RoleWithPermissions[];
}
