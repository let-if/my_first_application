import prisma from "../src/config/db.js";

async function main() {
  const categories = [
    { nameEn: "Traditional Coffee", nameAm: "ባህላዊ ቡና", icon: "coffee" },
    { nameEn: "Home Repair & Plumbing", nameAm: "የቤት ጥገና እና ቧንቧ", icon: "wrench" },
    { nameEn: "Catering & Enjera Supply", nameAm: "ምግብ እና እንጀራ አቅራቢ", icon: "utensils" },
    { nameEn: "Courier & Delivery", nameAm: "መልእክት እና እቃ ማድረስ", icon: "truck" },
  ];

  console.log("🌱 Starting seed...");

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { nameEn: cat.nameEn },
      update: {},
      create: cat,
    });
    console.log(`✓ Seeded category: ${category.nameEn} (${category.nameAm})`);
  }

  console.log(" Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });