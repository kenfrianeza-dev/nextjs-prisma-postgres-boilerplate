/**
 * Shared types for the Roles & Permissions module.
 * Centralised here to follow the DRY principle — every component,
 * store, hook, and column definition imports from this single source.
 */

// ─── Action States ───────────────────────────────────────────

export type RoleActionState = {
  errors?: {
    name?: string[];
    description?: string[];
    permissionIds?: string[];
  };
  data?: {
    name?: string;
    description?: string;
    permissionIds?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// ─── Domain Models ───────────────────────────────────────────

export type Permission = {
  id: string;
  action: string;
  resource: string;
  module: string | null;
  description: string | null;
};

export type RoleWithPermissions = {
  id: string;
  name: string;
  description: string | null;
  permissions: {
    permission: Permission;
  }[];
};

// ─── Component Props ─────────────────────────────────────────

export interface RolesClientProps {
  roles: RoleWithPermissions[];
  allPermissions: Permission[];
  userPermissions: string[];
}
