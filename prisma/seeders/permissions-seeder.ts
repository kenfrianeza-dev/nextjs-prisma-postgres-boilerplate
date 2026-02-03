import { PrismaClient } from "@prisma/client";

export async function seedPermissions(prisma: PrismaClient) {
  console.log("🔑 Seeding Permissions...");

  const permissions = [
    { module: "System", action: "*", resource: "*", description: "Full system access" },
    { module: "Dashboard", action: "read", resource: "dashboard", description: "Access dashboard" },
    
    // User Management
    { module: "User Management", action: "read", resource: "users", description: "View users" },
    { module: "User Management", action: "create", resource: "users", description: "Create users" },
    { module: "User Management", action: "update", resource: "users", description: "Update users" },
    { module: "User Management", action: "delete", resource: "users", description: "Delete users" },
    { module: "User Management", action: "manage", resource: "users", description: "Full user management" },
    
    { module: "User Management", action: "read", resource: "roles-and-permissions", description: "View roles and permissions" },
    { module: "User Management", action: "create", resource: "roles-and-permissions", description: "Create roles" },
    { module: "User Management", action: "update", resource: "roles-and-permissions", description: "Update roles" },
    { module: "User Management", action: "delete", resource: "roles-and-permissions", description: "Delete roles" },
    { module: "User Management", action: "manage", resource: "roles-and-permissions", description: "Full roles and permissions management" },
    
    // System Settings
    { module: "System Settings", action: "read", resource: "system-settings", description: "View system settings" },
    { module: "System Settings", action: "update", resource: "system-settings", description: "Update system settings" },
    
    // System Settings - Categories
    { module: "System Settings", action: "read", resource: "system-settings.organization", description: "View organization settings" },
    { module: "System Settings", action: "update", resource: "system-settings.organization", description: "Update organization settings" },
    
    { module: "System Settings", action: "read", resource: "system-settings.localization", description: "View localization settings" },
    { module: "System Settings", action: "update", resource: "system-settings.localization", description: "Update localization settings" },
    
    { module: "System Settings", action: "read", resource: "system-settings.user-auth-settings", description: "View user & auth settings" },
    { module: "System Settings", action: "update", resource: "system-settings.user-auth-settings", description: "Update user & auth settings" },
    
    { module: "System Settings", action: "read", resource: "system-settings.ui-branding", description: "View UI branding settings" },
    { module: "System Settings", action: "update", resource: "system-settings.ui-branding", description: "Update UI branding settings" },
    
    { module: "System Settings", action: "read", resource: "system-settings.system-behavior", description: "View system behavior settings" },
    { module: "System Settings", action: "update", resource: "system-settings.system-behavior", description: "Update system behavior settings" },
    
    { module: "System Settings", action: "read", resource: "system-settings.module-toggles", description: "View module toggle settings" },
    { module: "System Settings", action: "update", resource: "system-settings.module-toggles", description: "Update module toggle settings" },
    
    { module: "System Settings", action: "read", resource: "system-settings.financial-billing", description: "View financial & billing settings" },
    { module: "System Settings", action: "update", resource: "system-settings.financial-billing", description: "Update financial & billing settings" },
    
    { module: "System Settings", action: "read", resource: "system-settings.developer-integration", description: "View developer integration settings" },
    { module: "System Settings", action: "update", resource: "system-settings.developer-integration", description: "Update developer integration settings" },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: {
        action_resource: { action: p.action, resource: p.resource },
      },
      update: {
        description: p.description,
        module: p.module,
      },
      create: p,
    });
  }

  console.log("✅ Permissions seeded.");
}
