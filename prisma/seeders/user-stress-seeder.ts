import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../lib/password";

/**
 * Generates 5,000 dummy users to stress-test UI tables, client-side search,
 * and browser rendering limits.
 */
export async function seedUserStress(prisma: PrismaClient) {
  console.log("🏋️ Starting stress-test seed: generating 5,000 users...");
  
  // 1. Hash password once
  const defaultPassword = "Password123!";
  console.log("🔐 Pre-hashing standard password for all dummy users...");
  const hashedPassword = await hashPassword(defaultPassword);

  // 2. Cleanup previous runs
  console.log("🧹 Cleaning up previous stress-test users...");
  const { count: deletedCount } = await prisma.user.deleteMany({
    where: {
      email: {
        contains: "stress.test@dummy.com"
      }
    }
  });
  console.log(`🗑️ Deleted ${deletedCount} old stress-test users.`);

  // 3. Generate 5,000 objects
  const USERS_COUNT = 5000;
  console.log(`🏗️ Generating ${USERS_COUNT} user objects in memory...`);
  
  const dummyUsers = [];
  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Riley", "Cameron", "Peyton", "Quinn"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];

  for (let i = 1; i <= USERS_COUNT; i++) {
    const fIndex = i % firstNames.length;
    const lIndex = (i * 7) % lastNames.length;
    
    dummyUsers.push({
      email: `user${i}.stress.test@dummy.com`,
      firstName: `${firstNames[fIndex]} [${i}]`,
      lastName: `${lastNames[lIndex]} [${i}]`,
      phoneNumber: `+1-555-${String(i).padStart(4, '0')}`,
      passwordHash: hashedPassword,
      isActive: i % 5 !== 0, // Interleave active/inactive
    });
  }

  // 4. Insert in chunks
  console.log("💾 Bulk inserting into database via Prisma createMany...");
  const CHUNK_SIZE = 1000;
  
  for (let i = 0; i < dummyUsers.length; i += CHUNK_SIZE) {
    const chunk = dummyUsers.slice(i, i + CHUNK_SIZE);
    await prisma.user.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    console.log(`✅ Inserted batch ${(i / CHUNK_SIZE) + 1} (${i + chunk.length} / ${USERS_COUNT})...`);
  }

  const totalUsers = await prisma.user.count();
  console.log("🎉 Stress-test seeder complete!");
  console.log(`📊 Total users in DB: ${totalUsers}`);
  console.log(`🔑 All seeded dummy users have the password: "${defaultPassword}"`);
}
