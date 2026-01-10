import { prisma } from '@/lib/prisma';

async function main() {
  console.log('🌱 Seeding SuperAdmin role...');

  // 1. Create SuperAdmin role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SuperAdmin' },
    update: {},
    create: {
      name: 'SuperAdmin',
      description: 'Full system access',
    },
  });

  // 2. Create wildcard permission
  const allPermission = await prisma.permission.upsert({
    where: {
      action_resource: { action: '*', resource: '*' },
    },
    update: {},
    create: {
      action: '*',
      resource: '*',
      description: 'Full system access',
    },
  });

  // 3. Attach permission to role
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

  console.log('✅ SuperAdmin role seeded successfully');
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error('❌ Seed failed', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
