import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import crypto from "crypto";

const IS_PROD = process.env.NODE_ENV === "production";

function generatePassword() {
  return crypto.randomBytes(12).toString("base64url");
}

async function main() {
  console.log("🌱 Seeding SuperAdmin setup...");

  /**
   * 1. SuperAdmin Role
   */
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SuperAdmin" },
    update: {},
    create: {
      name: "SuperAdmin",
      description: "Full system access",
    },
  });

  /**
   * 2. Permissions Setup
   */
  const permissions = [
    { action: "*", resource: "*", description: "Full system access" },
    { action: "read", resource: "dashboard", description: "Access dashboard" },
    { action: "read", resource: "users", description: "View users" },
    {
      action: "read",
      resource: "permissions",
      description: "View permissions",
    },
    { action: "read", resource: "roles", description: "View roles" },
    { action: "read", resource: "system-settings", description: "View system settings" },
    { action: "read", resource: "system-settings.general", description: "View system settings general" },
    { action: "read", resource: "system-settings.appearance", description: "View system settings appearance" },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: {
        action_resource: { action: p.action, resource: p.resource },
      },
      update: {},
      create: p,
    });
  }

  const allPermission = await prisma.permission.findUniqueOrThrow({
    where: { action_resource: { action: "*", resource: "*" } },
  });

  const dashboardPermission = await prisma.permission.findUniqueOrThrow({
    where: { action_resource: { action: "read", resource: "dashboard" } },
  });

  /**
   * 3. Attach Permission to SuperAdmin Role
   */
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

  /**
   * 3b. Standard User Role
   */
  const userRole = await prisma.role.upsert({
    where: { name: "User" },
    update: {},
    create: {
      name: "User",
      description: "Standard user access",
    },
  });

  // Assign read:dashboard to User role
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
   * 4. Super Admin User
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

  /**
   * 4b. Standard User
   */
  const userEmail = "user.dev@gmail.com";
  // Reuse same password for simplicity in dev, or generate new one
  const userPassword = password;

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
   * 5. Assign Role to Users
   */
  // SuperAdmin
  const existingUserRole = await prisma.userRole.findFirst({
    where: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
      scopeType: null,
      scopeId: null,
    },
  });

  if (!existingUserRole) {
    await prisma.userRole.create({
      data: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }

  // Standard User
  const existingStandardUserRole = await prisma.userRole.findFirst({
    where: {
      userId: standardUser.id,
      roleId: userRole.id,
      scopeType: null,
      scopeId: null,
    },
  });

  if (!existingStandardUserRole) {
    await prisma.userRole.create({
      data: {
        userId: standardUser.id,
        roleId: userRole.id,
      },
    });
  }

  /**
   * 6. Output (Dev only)
   */
  console.log("✅ Seeding completed successfully");

  if (!IS_PROD) {
    console.log("------------------------------------------------");
    console.log("🔑 Super Admin Credentials (DEV ONLY)");
    console.log(`📧 Email: ${email}`);
    console.log(`🔒 Password: ${password}`);
    console.log("------------------------------------------------");
    console.log("🔑 Standard User Credentials (DEV ONLY)");
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🔒 Password: ${userPassword}`);
    console.log("------------------------------------------------");
  } else {
    console.log("🔐 Passwords not displayed (production environment)");
  }
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error("❌ Seed failed", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
