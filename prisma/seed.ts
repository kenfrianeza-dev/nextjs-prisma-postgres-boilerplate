import { prisma } from "@/lib/prisma";
import * as seeders from "@/prisma/seeders";

async function main() {
  const args = process.argv.slice(2);
  const targetModule = args[0]; // e.g., 'auth', 'permissions', 'settings'

  console.log("🌱 Starting database seeding...");

  if (targetModule) {
    switch (targetModule) {
      case "auth-seeder":
        await seeders.seedAuth(prisma);
        break;
      case "permissions-seeder":
        await seeders.seedPermissions(prisma);
        break;
      case "settings-seeder":
        await seeders.seedSystemSettings(prisma);
        break;
      default:
        console.error(`❌ Unknown seeder module: ${targetModule}`);
        process.exit(1);
    }
  } else {
    // Run all in order
    await seeders.seedPermissions(prisma);
    await seeders.seedAuth(prisma);
    await seeders.seedSystemSettings(prisma);
  }

  console.log("✅ Seeding process finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
