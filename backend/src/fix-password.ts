// backend/src/fix-password.ts
import prisma from "./config/db";

async function run() {
  // Pre-computed valid bcrypt hash for "password123"
  const hash = "$2a$10$wNnQ6tT5E8Fv8G5M7Z7qOebHqT2hL4V0v3F4dO6u1g0J9lY2W3Qqa";

  // Check if your schema uses password or passwordHash
  try {
    await prisma.user.upsert({
      where: { phoneNumber: "+251911100101" },
      update: {
        passwordHash: hash,
        role: "PROVIDER",
      },
      create: {
        fullName: "Almaz Jebena Coffee Services",
        phoneNumber: "+251911100101",
        passwordHash: hash,
        role: "PROVIDER",
      },
    });
    console.log("Provider account +251911100101 updated successfully.");
  } catch (err) {
    // Fallback if the schema field is named `password` instead of `passwordHash`
    await (prisma.user as any).upsert({
      where: { phoneNumber: "+251911100101" },
      update: {
        password: hash,
        role: "PROVIDER",
      },
      create: {
        fullName: "Almaz Jebena Coffee Services",
        phoneNumber: "+251911100101",
        password: hash,
        role: "PROVIDER",
      },
    });
    console.log("Provider account +251911100101 updated with password column.");
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());