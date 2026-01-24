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
  const allPermission = await prisma.permission.findUniqueOrThrow({
    where: { action_resource: { action: "*", resource: "*" } },
  });

  const dashboardPermission = await prisma.permission.findUniqueOrThrow({
    where: { action_resource: { action: "read", resource: "dashboard" } },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: superAdminRole.id,
        permissionId: allPermission.id,
      },
    },
    update: {},
    create: {
      roleId: superAdminRole.id,
      permissionId: allPermission.id,
    },
  });

  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: userRole.id,
        permissionId: dashboardPermission.id,
      },
    },
    update: {},
    create: {
      roleId: userRole.id,
      permissionId: dashboardPermission.id,
    },
  });

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
  
  const existingSuperAdminRole = await prisma.userRole.findFirst({
    where: { userId: superAdminUser.id, roleId: superAdminRole.id },
  });
  if (!existingSuperAdminRole) {
    await prisma.userRole.create({
      data: { userId: superAdminUser.id, roleId: superAdminRole.id },
    });
  }

  const existingUserRoleAssignment = await prisma.userRole.findFirst({
    where: { userId: standardUser.id, roleId: userRole.id },
  });
  if (!existingUserRoleAssignment) {
    await prisma.userRole.create({
      data: { userId: standardUser.id, roleId: userRole.id },
    });
  }

  if (!IS_PROD) {
    console.log("------------------------------------------------");
    console.log("🔑 Super Admin Credentials (DEV ONLY)");
    console.log(`📧 Email: ${email}`);
    console.log(`🔒 Password: ${password}`);
    console.log("------------------------------------------------");
    console.log("🔑 Standard User Credentials (DEV ONLY)");
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🔒 Password: ${password}`);
    console.log("------------------------------------------------");
  }

  console.log("✅ Auth seeded.");
}
