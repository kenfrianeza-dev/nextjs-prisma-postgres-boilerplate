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
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get all available roles with permissions.
   */
  async getAllRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  /**
   * Get a role by ID with permissions.
   */
  async getRoleById(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  },

  /**
   * Create a new role.
   */
  async createRole(data: {
    name: string;
    description?: string;
    permissionIds?: string[];
  }) {
    const { permissionIds, ...roleData } = data;

    return prisma.role.create({
      data: {
        ...roleData,
        permissions: {
          create: permissionIds?.map((permissionId) => ({
            permissionId,
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  },

  /**
   * Update an existing role.
   */
  async updateRole(
    id: string,
    data: {
      name?: string;
      description?: string;
      permissionIds?: string[];
    },
  ) {
    const { permissionIds, ...roleData } = data;

    return prisma.$transaction(async (tx) => {
      if (permissionIds) {
        // Delete existing permissions
        await tx.rolePermission.deleteMany({
          where: { roleId: id },
        });

        // Add new permissions
        if (permissionIds.length > 0) {
          await tx.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
              roleId: id,
              permissionId,
            })),
          });
        }
      }

      return tx.role.update({
        where: { id },
        data: roleData,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });
  },

  /**
   * Delete a role.
   */
  async deleteRole(id: string) {
    return prisma.role.delete({
      where: { id },
    });
  },

  /**
   * Get all permissions.
   */
  async getAllPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ resource: "asc" }, { action: "asc" }],
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
        permissions: {
          include: {
            permission: true,
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
    permissionIds?: string[];
  }) {
    const { roleIds, permissionIds, ...userData } = data;

    return prisma.user.create({
      data: {
        ...userData,
        roles: {
          create: roleIds?.map((roleId) => ({
            roleId,
          })),
        },
        permissions: {
          create: permissionIds?.map((permissionId) => ({
            permissionId,
          })),
        },
      },
    });
  },

  /**
   * Update an existing user.
   */
  async updateUser(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      isActive?: boolean;
      roleIds?: string[];
      permissionIds?: string[];
    },
  ) {
    const { roleIds, permissionIds, ...userData } = data;

    return prisma.$transaction(async (tx) => {
      if (roleIds) {
        // Delete existing roles
        await tx.userRole.deleteMany({
          where: { userId: id },
        });

        // Add new roles
        if (roleIds.length > 0) {
          await tx.userRole.createMany({
            data: roleIds.map((roleId) => ({
              userId: id,
              roleId,
            })),
          });
        }
      }

      if (permissionIds) {
        // Delete existing permissions
        await tx.userPermission.deleteMany({
          where: { userId: id },
        });

        // Add new permissions
        if (permissionIds.length > 0) {
          await tx.userPermission.createMany({
            data: permissionIds.map((permissionId) => ({
              userId: id,
              permissionId,
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
          permissions: {
            include: {
              permission: true,
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
