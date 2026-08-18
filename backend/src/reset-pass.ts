// backend/src/reset-pass.ts
import bcrypt from "bcrypt";
import prisma from "./config/db.js";

async function main() {
  const plainPassword = "password123";
  const newHash = await bcrypt.hash(plainPassword, 10);

  const updated = await prisma.user.update({
    where: { phoneNumber: "+251911100101" },
    data: { passwordHash: newHash },
  });

  // Verify immediately that bcrypt matches
  const verify = await bcrypt.compare(plainPassword, updated.passwordHash);
  console.log(`✅ User ${updated.phoneNumber} password updated!`);
  console.log(`🔒 bcrypt.compare verification test: ${verify ? "PASSED (true)" : "FAILED (false)"}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());