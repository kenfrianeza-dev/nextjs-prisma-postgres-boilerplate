import { AppError } from "@/lib/errors";
import { UserManagementPolicy } from "./user-management.policy";
import { UserManagementRepo } from "./user-management.repo";
import { hashPassword } from "@/lib/password";

export const UserManagementService = {
  /**
   * Get all users.
   */
  async getUsers(userPermissions: string[]) {
    if (!UserManagementPolicy.canViewUsers(userPermissions)) {
      throw AppError.forbidden("You do not have permission to view users.");
    }

    return UserManagementRepo.getAllUsers();
  },

  /**
   * Get all available roles.
   */
  async getRoles(userPermissions: string[]) {
    if (!UserManagementPolicy.canViewRoles(userPermissions)) {
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
    if (!UserManagementPolicy.canCreateUser(userPermissions)) {
      throw AppError.forbidden("You do not have permission to create users.");
    }

    const passwordHash = await hashPassword(data.password || "Password123!"); // Default password

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
    if (!UserManagementPolicy.canUpdateUser(userPermissions)) {
      throw AppError.forbidden("You do not have permission to update users.");
    }

    return UserManagementRepo.updateUser(id, data);
  },

  /**
   * Delete a user.
   */
  async deleteUser(userPermissions: string[], id: string) {
    if (!UserManagementPolicy.canDeleteUser(userPermissions)) {
      throw AppError.forbidden("You do not have permission to delete users.");
    }

    return UserManagementRepo.deleteUser(id);
  },

  /**
   * Get all permissions (placeholder logic).
   */
  async getPermissions(userPermissions: string[]) {
    if (!UserManagementPolicy.canViewPermissions(userPermissions)) {
      throw AppError.forbidden("You do not have permission to view permissions.");
    }

    return [];
  },
};
