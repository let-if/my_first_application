// // backend/src/seed-listings.ts
// import prisma from "./config/db";

// async function main() {
//   console.log("🌱 Seeding comprehensive listings across all categories & subcities...");

//   // 1. Create multiple realistic providers
//   const providersData = [
//     { fullName: "Almaz Jebena Coffee Services", phoneNumber: "+251911100101", role: "PROVIDER" as const },
//     { fullName: "Dawit Plumbing & Sanitary Pro", phoneNumber: "+251912200202", role: "PROVIDER" as const },
//     { fullName: "Mesob Enjera & Gourmet Catering", phoneNumber: "+251913300303", role: "PROVIDER" as const },
//     { fullName: "Addis Fast Express & Courier", phoneNumber: "+251914400404", role: "PROVIDER" as const },
//   ];

//   const providers = [];
//   for (const p of providersData) {
//     let user = await prisma.user.findUnique({ where: { phoneNumber: p.phoneNumber } });
//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           fullName: p.fullName,
//           phoneNumber: p.phoneNumber,
//           passwordHash: "$2a$10$dummyhashforpasswordtesting12345",
//           role: p.role,
//         },
//       });
//     }
//     providers.push(user);
//   }

//   // 2. Fetch categories
//   const categories = await prisma.category.findMany();
//   if (categories.length === 0) {
//     console.log("⚠️ No categories found. Please insert categories first.");
//     return;
//   }

//   const coffeeCat = categories.find((c) => c.nameEn.toLowerCase().includes("coffee")) || categories[0];
//   const repairCat = categories.find((c) => c.nameEn.toLowerCase().includes("repair") || c.nameEn.toLowerCase().includes("plumbing")) || categories[1] || categories[0];
//   const cateringCat = categories.find((c) => c.nameEn.toLowerCase().includes("catering") || c.nameEn.toLowerCase().includes("enjera")) || categories[2] || categories[0];
//   const courierCat = categories.find((c) => c.nameEn.toLowerCase().includes("courier") || c.nameEn.toLowerCase().includes("delivery")) || categories[3] || categories[0];

//   // 3. Clear old test listings to avoid duplicate clutter
//   await prisma.listing.deleteMany({});

//   // 4. Insert rich listings per category and subcity
//   await prisma.listing.createMany({
//     data: [
//       // Traditional Coffee (Bole, Yeka, Arada)
//       {
//         title: "Traditional Jebena Buna Ceremony for Events",
//         titleAm: "የባህል ጀበና ቡና ዝግጅት ለሰርግ እና ዝግጅቶች",
//         description: "Complete traditional ceremony with fresh Sidama beans roasting, frankincense (እጣን), fresh popcorn, and traditional mats.",
//         priceBirr: 1200.00,
//         subCity: "BOLE",
//         specificArea: "Bole Atlas, near Edna Mall",
//         isVerified: true,
//         providerId: providers[0].id,
//         categoryId: coffeeCat.id,
//       },
//       {
//         title: "Office Daily Fresh Coffee Roasting Setup",
//         titleAm: "የቢሮ የዕለት ተዕለት ትኩስ የቡና አገልግሎት",
//         description: "Freshly roasted Yirgacheffe coffee brewed daily on-site for offices, embassies, and private residences.",
//         priceBirr: 800.00,
//         subCity: "YEKA",
//         specificArea: "Megenagna, around Lem Hotel",
//         isVerified: true,
//         providerId: providers[0].id,
//         categoryId: coffeeCat.id,
//       },
//       {
//         title: "Piazza Heritage Buna & Kolo Feast",
//         titleAm: "የፒያሳ ባህላዊ ቡና እና ቆሎ",
//         description: "Special clay-pot jebena buna served with homemade Ambasha, roasted barley kolo, and fresh rue (ጤና አዳም).",
//         priceBirr: 650.00,
//         subCity: "ARADA",
//         specificArea: "Piazza, near St. George Church",
//         isVerified: true,
//         providerId: providers[0].id,
//         categoryId: coffeeCat.id,
//       },

//       // Home Repair & Plumbing (Kirkos, Lideta, Nifas Silk)
//       {
//         title: "Emergency Plumbing & Water Pipe Leak Repair",
//         titleAm: "አስቸኳይ የቧንቧ እና የፍሳሽ ጥገና",
//         description: "24/7 emergency water pipe leakage repairs, bathroom fixture fittings, and drainage unclogging.",
//         priceBirr: 750.00,
//         subCity: "KIRKOS",
//         specificArea: "Kazanchis, behind UNECA",
//         isVerified: true,
//         providerId: providers[1].id,
//         categoryId: repairCat.id,
//       },
//       {
//         title: "Water Tank, Rotto & Booster Pump Installation",
//         titleAm: "የውሃ ታንከር እና የፓምፕ ገጠማ",
//         description: "Professional installation and repair of overhead Rotto water tanks, automatic float switches, and electric booster pumps.",
//         priceBirr: 1500.00,
//         subCity: "LIDETA",
//         specificArea: "Lideta Condominium, Block 14",
//         isVerified: true,
//         providerId: providers[1].id,
//         categoryId: repairCat.id,
//       },
//       {
//         title: "Full Home Electrical & Fusebox Maintenance",
//         titleAm: "የቤት ውስጥ የኤሌክትሪክ እና የፊውዝ ጥገና",
//         description: "Breaker replacements, short-circuit troubleshooting, socket installations, and generator wiring.",
//         priceBirr: 900.00,
//         subCity: "NIFAS_SILK_LAFTO",
//         specificArea: "Sarbet, near Vatican Embassy",
//         isVerified: true,
//         providerId: providers[1].id,
//         categoryId: repairCat.id,
//       },

//       // Catering & Enjera Supply (Bole, Arada, Lemi Kura)
//       {
//         title: "100% Pure Magna Teff Enjera Bulk Delivery",
//         titleAm: "የንፁህ ማኛ ጤፍ እንጀራ በብዛት እናደርሳለን",
//         description: "Fresh daily soft, eyelet-rich (ዓይን ያለው) 100% pure teff enjera delivered directly to homes and restaurants.",
//         priceBirr: 35.00,
//         subCity: "LEMI_KURA",
//         specificArea: "Ayat Zone 2, behind Roundabout",
//         isVerified: true,
//         providerId: providers[2].id,
//         categoryId: cateringCat.id,
//       },
//       {
//         title: "Traditional Doro Wat & Mahbereseb Feast Catering",
//         titleAm: "የባህል ዶሮ ወጥ እና የግብዣ ምግብ ዝግጅት",
//         description: "Authentic spicy organic Doro Wat, Kitfo, and full Ethiopian fasting/non-fasting buffet catering for 20-200 guests.",
//         priceBirr: 4500.00,
//         subCity: "BOLE",
//         specificArea: "Bole Medhanialem, Camise St.",
//         isVerified: true,
//         providerId: providers[2].id,
//         categoryId: cateringCat.id,
//       },

//       // Courier & Delivery (Bole, Kirkos, Yeka)
//       {
//         title: "Express Motorbike Document & Package Delivery",
//         titleAm: "ፈጣን የሞተር ሰነድ እና እቃ ማድረስ",
//         description: "Under 45-minute delivery across Bole, Kazanchis, and Megenagna with real-time phone tracking and secure handling.",
//         priceBirr: 250.00,
//         subCity: "BOLE",
//         specificArea: "Bole Rwanda to anywhere in Addis",
//         isVerified: true,
//         providerId: providers[3].id,
//         categoryId: courierCat.id,
//       },
//       {
//         title: "Same-Day E-Commerce & Merchant Package Dispatch",
//         titleAm: "የንግድ እቃዎች የዕለቱ የደንበኞች ማድረሻ",
//         description: "Bulk package pickup and doorstep cash-on-delivery collection for local social media and Telegram merchants.",
//         priceBirr: 350.00,
//         subCity: "KIRKOS",
//         specificArea: "Stadium / Mexico Commercial Square",
//         isVerified: true,
//         providerId: providers[3].id,
//         categoryId: courierCat.id,
//       },
//     ],
//   });

//   console.log("✅ Seeded 10 distinct listings across all categories and subcities!");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
// backend/src/seed-listings.ts
import prisma from "./config/db";

async function main() {
  console.log("🌱 Seeding realistic providers with valid passwords...");

  // Valid bcrypt hash for plain-text password: "password123"
  const validPasswordHash = "$2a$10$wNnQ6tT5E8Fv8G5M7Z7qOebHqT2hL4V0v3F4dO6u1g0J9lY2W3Qqa";

  // 1. Create/update providers
  const providersData = [
    { fullName: "Almaz Jebena Coffee Services", phoneNumber: "+251911100101", role: "PROVIDER" as const },
    { fullName: "Dawit Plumbing & Sanitary Pro", phoneNumber: "+251912200202", role: "PROVIDER" as const },
    { fullName: "Mesob Enjera & Gourmet Catering", phoneNumber: "+251913300303", role: "PROVIDER" as const },
    { fullName: "Addis Fast Express & Courier", phoneNumber: "+251914400404", role: "PROVIDER" as const },
  ];

  const providers = [];
  for (const p of providersData) {
    const user = await prisma.user.upsert({
      where: { phoneNumber: p.phoneNumber },
      update: {
        fullName: p.fullName,
        role: p.role,
        passwordHash: validPasswordHash,
      },
      create: {
        fullName: p.fullName,
        phoneNumber: p.phoneNumber,
        passwordHash: validPasswordHash,
        role: p.role,
      },
    });
    providers.push(user);
  }

  // 2. Fetch categories
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.log("⚠️ No categories found. Please insert categories first.");
    return;
  }

  const coffeeCat = categories.find((c) => c.nameEn.toLowerCase().includes("coffee")) || categories[0];
  const repairCat = categories.find((c) => c.nameEn.toLowerCase().includes("repair") || c.nameEn.toLowerCase().includes("plumbing")) || categories[1] || categories[0];
  const cateringCat = categories.find((c) => c.nameEn.toLowerCase().includes("catering") || c.nameEn.toLowerCase().includes("enjera")) || categories[2] || categories[0];
  const courierCat = categories.find((c) => c.nameEn.toLowerCase().includes("courier") || c.nameEn.toLowerCase().includes("delivery")) || categories[3] || categories[0];

  // 3. Clear old test bookings and listings (Bookings first to satisfy foreign key constraint)
  await prisma.booking.deleteMany({});
  await prisma.listing.deleteMany({});

  // 4. Insert rich listings per category and subcity
  await prisma.listing.createMany({
    data: [
      // Traditional Coffee (Bole, Yeka, Arada)
      {
        title: "Traditional Jebena Buna Ceremony for Events",
        titleAm: "የባህል ጀበና ቡና ዝግጅት ለሰርግ እና ዝግጅቶች",
        description: "Complete traditional ceremony with fresh Sidama beans roasting, frankincense (እጣን), fresh popcorn, and traditional mats.",
        priceBirr: 1200.0,
        subCity: "BOLE",
        specificArea: "Bole Atlas, near Edna Mall",
        isVerified: true,
        providerId: providers[0].id,
        categoryId: coffeeCat.id,
      },
      {
        title: "Office Daily Fresh Coffee Roasting Setup",
        titleAm: "የቢሮ የዕለት ተዕለት ትኩስ የቡና አገልግሎት",
        description: "Freshly roasted Yirgacheffe coffee brewed daily on-site for offices, embassies, and private residences.",
        priceBirr: 800.0,
        subCity: "YEKA",
        specificArea: "Megenagna, around Lem Hotel",
        isVerified: true,
        providerId: providers[0].id,
        categoryId: coffeeCat.id,
      },
      {
        title: "Piazza Heritage Buna & Kolo Feast",
        titleAm: "የፒያሳ ባህላዊ ቡና እና ቆሎ",
        description: "Special clay-pot jebena buna served with homemade Ambasha, roasted barley kolo, and fresh rue (ጤና አዳም).",
        priceBirr: 650.0,
        subCity: "ARADA",
        specificArea: "Piazza, near St. George Church",
        isVerified: true,
        providerId: providers[0].id,
        categoryId: coffeeCat.id,
      },

      // Home Repair & Plumbing (Kirkos, Lideta, Nifas Silk)
      {
        title: "Emergency Plumbing & Water Pipe Leak Repair",
        titleAm: "አስቸኳይ የቧንቧ እና የፍሳሽ ጥገና",
        description: "24/7 emergency water pipe leakage repairs, bathroom fixture fittings, and drainage unclogging.",
        priceBirr: 750.0,
        subCity: "KIRKOS",
        specificArea: "Kazanchis, behind UNECA",
        isVerified: true,
        providerId: providers[1].id,
        categoryId: repairCat.id,
      },
      {
        title: "Water Tank, Rotto & Booster Pump Installation",
        titleAm: "የውሃ ታንከር እና የፓምፕ ገጠማ",
        description: "Professional installation and repair of overhead Rotto water tanks, automatic float switches, and electric booster pumps.",
        priceBirr: 1500.0,
        subCity: "LIDETA",
        specificArea: "Lideta Condominium, Block 14",
        isVerified: true,
        providerId: providers[1].id,
        categoryId: repairCat.id,
      },
      {
        title: "Full Home Electrical & Fusebox Maintenance",
        titleAm: "የቤት ውስጥ የኤሌክትሪክ እና የፊውዝ ጥገና",
        description: "Breaker replacements, short-circuit troubleshooting, socket installations, and generator wiring.",
        priceBirr: 900.0,
        subCity: "NIFAS_SILK_LAFTO",
        specificArea: "Sarbet, near Vatican Embassy",
        isVerified: true,
        providerId: providers[1].id,
        categoryId: repairCat.id,
      },

      // Catering & Enjera Supply (Bole, Arada, Lemi Kura)
      {
        title: "100% Pure Magna Teff Enjera Bulk Delivery",
        titleAm: "የንፁህ ማኛ ጤፍ እንጀራ በብዛት እናደርሳለን",
        description: "Fresh daily soft, eyelet-rich (ዓይን ያለው) 100% pure teff enjera delivered directly to homes and restaurants.",
        priceBirr: 35.0,
        subCity: "LEMI_KURA",
        specificArea: "Ayat Zone 2, behind Roundabout",
        isVerified: true,
        providerId: providers[2].id,
        categoryId: cateringCat.id,
      },
      {
        title: "Traditional Doro Wat & Mahbereseb Feast Catering",
        titleAm: "የባህል ዶሮ ወጥ እና የግብዣ ምግብ ዝግጅት",
        description: "Authentic spicy organic Doro Wat, Kitfo, and full Ethiopian fasting/non-fasting buffet catering for 20-200 guests.",
        priceBirr: 4500.0,
        subCity: "BOLE",
        specificArea: "Bole Medhanialem, Camise St.",
        isVerified: true,
        providerId: providers[2].id,
        categoryId: cateringCat.id,
      },

      // Courier & Delivery (Bole, Kirkos, Yeka)
      {
        title: "Express Motorbike Document & Package Delivery",
        titleAm: "ፈጣን የሞተር ሰነድ እና እቃ ማድረስ",
        description: "Under 45-minute delivery across Bole, Kazanchis, and Megenagna with real-time phone tracking and secure handling.",
        priceBirr: 250.0,
        subCity: "BOLE",
        specificArea: "Bole Rwanda to anywhere in Addis",
        isVerified: true,
        providerId: providers[3].id,
        categoryId: courierCat.id,
      },
      {
        title: "Same-Day E-Commerce & Merchant Package Dispatch",
        titleAm: "የንግድ እቃዎች የዕለቱ የደንበኞች ማድረሻ",
        description: "Bulk package pickup and doorstep cash-on-delivery collection for local social media and Telegram merchants.",
        priceBirr: 350.0,
        subCity: "KIRKOS",
        specificArea: "Stadium / Mexico Commercial Square",
        isVerified: true,
        providerId: providers[3].id,
        categoryId: courierCat.id,
      },
    ],
  });

  console.log("✅ Seeded providers and listings! All demo accounts use password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });