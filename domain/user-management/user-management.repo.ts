import { prisma } from "@/lib/prisma";

export const UserManagementRepo = {
  /**
   * Get all users with their roles.
   */
  async getAllUsers() {
    return prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Get all available roles.
   */
  async getAllRoles() {
    return prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  },

  /**
   * Find a user by ID.
   */
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  },

  /**
   * Create a new user.
   */
  async createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    roleIds?: string[];
  }) {
    const { roleIds, ...userData } = data;
    
    return prisma.user.create({
      data: {
        ...userData,
        roles: {
          create: roleIds?.map(roleId => ({
            roleId,
          })),
        },
      },
    });
  },

  /**
   * Update an existing user.
   */
  async updateUser(id: string, data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    roleIds?: string[];
  }) {
    const { roleIds, ...userData } = data;

    return prisma.$transaction(async (tx) => {
      if (roleIds) {
        // Delete existing roles
        await tx.userRole.deleteMany({
          where: { userId: id },
        });

        // Add new roles
        if (roleIds.length > 0) {
          await tx.userRole.createMany({
            data: roleIds.map(roleId => ({
              userId: id,
              roleId,
            })),
          });
        }
      }

      return tx.user.update({
        where: { id },
        data: userData,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });
  },

  /**
   * Delete a user.
   */
  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
