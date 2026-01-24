import { PrismaClient } from "@prisma/client";

export async function seedPermissions(prisma: PrismaClient) {
  console.log("🔑 Seeding Permissions...");

  const permissions = [
    { action: "*", resource: "*", description: "Full system access" },
    { action: "read", resource: "dashboard", description: "Access dashboard" },
    { action: "read", resource: "users", description: "View users" },
    { action: "read", resource: "permissions", description: "View permissions" },
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
      update: {
        description: p.description,
      },
      create: p,
    });
  }

  console.log("✅ Permissions seeded.");
}
