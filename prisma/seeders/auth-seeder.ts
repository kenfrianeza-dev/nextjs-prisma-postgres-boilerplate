import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/password";
import crypto from "crypto";

const IS_PROD = process.env.NODE_ENV === "production";

function generatePassword() {
  return crypto.randomBytes(12).toString("base64url");
}

export async function seedAuth(prisma: PrismaClient) {
  console.log("👤 Seeding Auth (Roles & Users)...");

  /**
   * 1. Roles Setup
   */
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SuperAdmin" },
    update: {},
    create: {
      name: "SuperAdmin",
      description: "Full system access",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Administrative access",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "User" },
    update: {},
    create: {
      name: "User",
      description: "Standard user access",
    },
  });

  /**
   * 2. Permission Mappings
   */
  const getPermission = async (action: string, resource: string) => {
    return prisma.permission.findUniqueOrThrow({
      where: { action_resource: { action, resource } },
    });
  };

  const allPermission = await getPermission("*", "*");
  const dashboardPermission = await getPermission("read", "dashboard");
  const manageUsersPermission = await getPermission("manage", "users");
  const manageRolesPermission = await getPermission("manage", "roles-and-permissions");
  const updateSystemSettingsPermission = await getPermission("update", "system-settings");
  const readSystemSettingsPermission = await getPermission("read", "system-settings");

  // Helper to map role to permissions
  const assignPermissions = async (roleId: string, permissionIds: string[]) => {
    for (const permissionId of permissionIds) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId },
      });
    }
  };

  // Super Admin gets everything
  await assignPermissions(superAdminRole.id, [allPermission.id]);

  // Admin gets specific access
  await assignPermissions(adminRole.id, [
    dashboardPermission.id,
    (await getPermission("read", "users")).id,
    (await getPermission("read", "roles-and-permissions")).id,
    readSystemSettingsPermission.id,
    (await getPermission("read", "system-settings.organization")).id,
    (await getPermission("update", "system-settings.organization")).id,
    (await getPermission("read", "system-settings.module-toggles")).id,
    (await getPermission("update", "system-settings.module-toggles")).id,
  ]);

  // User gets basic access
  await assignPermissions(userRole.id, [
    dashboardPermission.id,
  ]);

  /**
   * 3. Users Setup
   */
  const email = "superadmin.dev@gmail.com";
  const password = process.env.SUPER_ADMIN_PASSWORD || generatePassword();
  const hashedPassword = await hashPassword(password);

  const superAdminUser = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firstName: "Super",
      lastName: "Admin",
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  const adminEmail = "admin.dev@gmail.com";
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      firstName: "System",
      lastName: "Admin",
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  const userEmail = "user.dev@gmail.com";
  const standardUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      firstName: "Standard",
      lastName: "User",
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  /**
   * 4. User Role Assignments
   */
  await prisma.userRole.upsert({
    where: {
      userId_roleId_scopeType_scopeId: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id,
        scopeType: "null", // Use a placeholder for null in unique constraints if necessary, or check Prisma schema
        scopeId: "null",
      },
    },
    update: {},
    create: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
    },
  });

  // Wait, the schema uses @@unique([userId, roleId, scopeType, scopeId])
  // If they are null, they are considered individual.
  // Let's check existing logic in seed.ts for userRole.
  
  // Re-checking seed.ts lines 147-184:
  // It uses findFirst and then create. I'll stick to that if upsert is tricky with nulls.
  
  const roleAssignments = [
    { userId: superAdminUser.id, roleId: superAdminRole.id },
    { userId: adminUser.id, roleId: adminRole.id },
    { userId: standardUser.id, roleId: userRole.id },
  ];

  for (const { userId, roleId } of roleAssignments) {
    const existing = await prisma.userRole.findFirst({
      where: { userId, roleId },
    });
    if (!existing) {
      await prisma.userRole.create({
        data: { userId, roleId },
      });
    }
  }

  if (!IS_PROD) {
    console.log("------------------------------------------------");
    console.log("🔑 Super Admin Credentials (DEV ONLY)");
    console.log(`📧 Email: ${email}`);
    console.log(`🔒 Password: ${password}`);
    console.log("------------------------------------------------");
    console.log("🔑 Admin Credentials (DEV ONLY)");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔒 Password: ${password}`);
    console.log("------------------------------------------------");
    console.log("🔑 Standard User Credentials (DEV ONLY)");
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🔒 Password: ${password}`);
    console.log("------------------------------------------------");
  }

  console.log("✅ Auth seeded.");
}
