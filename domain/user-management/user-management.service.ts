import { AppError } from "@/lib/errors";
import { UserManagementPolicy } from '@/domain/user-management/user-management.policy';
import { UserManagementRepo } from '@/domain/user-management/user-management.repo';
import { hashPassword } from "@/lib/password";

export const UserManagementService = {
  /**
   * Get all users.
   */
  async getUsers(userPermissions: string[]) {
    if (!UserManagementPolicy.viewUsers(userPermissions)) {
      throw AppError.forbidden("You do not have permission to view users.");
    }

    return UserManagementRepo.getAllUsers();
  },

  /**
   * Get all available roles.
   */
  async getRoles(userPermissions: string[]) {
    if (!UserManagementPolicy.viewRoles(userPermissions)) {
      throw AppError.forbidden("You do not have permission to view roles.");
    }

    return UserManagementRepo.getAllRoles();
  },

  /**
   * Create a new user.
   */
  async createUser(userPermissions: string[], data: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    roleIds?: string[];
  }) {
    if (!UserManagementPolicy.createUser(userPermissions)) {
      throw AppError.forbidden("You do not have permission to create users.");
    }

    const passwordHash = await hashPassword(data.password || "ChangeMeImmediately!"); // Default password

    return UserManagementRepo.createUser({
      ...data,
      passwordHash,
    });
  },

  /**
   * Update an existing user.
   */
  async updateUser(userPermissions: string[], id: string, data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    roleIds?: string[];
  }) {
    if (!UserManagementPolicy.updateUser(userPermissions)) {
      throw AppError.forbidden("You do not have permission to update users.");
    }

    return UserManagementRepo.updateUser(id, data);
  },

  /**
   * Delete a user.
   */
  async deleteUser(userPermissions: string[], id: string) {
    if (!UserManagementPolicy.deleteUser(userPermissions)) {
      throw AppError.forbidden("You do not have permission to delete users.");
    }

    return UserManagementRepo.deleteUser(id);
  },

  /**
   * Get all permissions.
   */
  async getPermissions(userPermissions: string[]) {
    if (!UserManagementPolicy.viewPermissions(userPermissions)) {
      throw AppError.forbidden("You do not have permission to view permissions.");
    }

    return UserManagementRepo.getAllPermissions();
  },

  /**
   * Get a role by ID.
   */
  async getRoleById(userPermissions: string[], id: string) {
    if (!UserManagementPolicy.viewRoles(userPermissions)) {
      throw AppError.forbidden("You do not have permission to view roles.");
    }

    return UserManagementRepo.getRoleById(id);
  },

  /**
   * Create a new role.
   */
  async createRole(userPermissions: string[], data: {
    name: string;
    description?: string;
    permissionIds?: string[];
  }) {
    if (!UserManagementPolicy.createRole(userPermissions)) {
      throw AppError.forbidden("You do not have permission to create roles.");
    }

    return UserManagementRepo.createRole(data);
  },

  /**
   * Update an existing role.
   */
  async updateRole(userPermissions: string[], id: string, data: {
    name?: string;
    description?: string;
    permissionIds?: string[];
  }) {
    if (!UserManagementPolicy.updateRole(userPermissions)) {
      throw AppError.forbidden("You do not have permission to update roles.");
    }

    return UserManagementRepo.updateRole(id, data);
  },

  /**
   * Delete a role.
   */
  async deleteRole(userPermissions: string[], id: string) {
    if (!UserManagementPolicy.deleteRole(userPermissions)) {
      throw AppError.forbidden("You do not have permission to delete roles.");
    }

    return UserManagementRepo.deleteRole(id);
  },
};
