import { PrismaClient } from "@prisma/client";

export async function seedPermissions(prisma: PrismaClient) {
  console.log("🔑 Seeding Permissions...");

  const permissions = [
    { action: "*", resource: "*", description: "Full system access" },
    { action: "read", resource: "dashboard", description: "Access dashboard" },
    
    // User Management
    { action: "read", resource: "users", description: "View users" },
    { action: "create", resource: "users", description: "Create users" },
    { action: "update", resource: "users", description: "Update users" },
    { action: "delete", resource: "users", description: "Delete users" },
    { action: "manage", resource: "users", description: "Full user management" },
    
    { action: "read", resource: "roles", description: "View roles" },
    { action: "create", resource: "roles", description: "Create roles" },
    { action: "update", resource: "roles", description: "Update roles" },
    { action: "delete", resource: "roles", description: "Delete roles" },
    
    { action: "read", resource: "permissions", description: "View permissions" },
    
    // System Settings
    { action: "read", resource: "system-settings", description: "View system settings" },
    { action: "update", resource: "system-settings", description: "Update system settings" },
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
