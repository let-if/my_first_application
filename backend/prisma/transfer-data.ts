// import { PrismaClient } from "@prisma/client";
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";

// async function migrateData() {
//   console.log("🚀 Starting data transfer from local PostgreSQL to Neon...");

//   // 1. EXTRACT DATA FROM LOCAL DATABASE
//   const localConnectionString = "postgresql://postgres:Letif7327@localhost:5432/ethio_services_db?schema=public";
  
//   const localPool = new Pool({ connectionString: localConnectionString });
//   const localAdapter = new PrismaPg(localPool);
//   const localDb = new PrismaClient({ adapter: localAdapter });

//   console.log("📥 Reading from local database...");
//   const users = await localDb.user.findMany();
//   const listings = await localDb.listing.findMany();
//   const bookings = await localDb.booking.findMany();
//   const reviews = await localDb.review.findMany();
  
//   let chats: any[] = [];
//   try {
//     chats = await (localDb as any).chat?.findMany() || await (localDb as any).message?.findMany() || [];
//   } catch (e) {
//     console.log("ℹ️ No chat table found or skipped.");
//   }

//   console.log(`Found locally: ${users.length} users, ${listings.length} listings, ${bookings.length} bookings, ${reviews.length} reviews, ${chats.length} chats.`);
//   await localDb.$disconnect();
//   await localPool.end();

//   // 2. PUSH DATA TO NEON CLOUD DATABASE
//   const neonConnectionString = "postgresql://neondb_owner:npg_c4athI7lUinq@ep-billowing-sky-axwmuo0h-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=verify-full";

//   const neonPool = new Pool({ connectionString: neonConnectionString });
//   const neonAdapter = new PrismaPg(neonPool);
//   const neonDb = new PrismaClient({ adapter: neonAdapter });

//   try {
//     console.log("☁️ Inserting data into Neon cloud database...");

//     // Migrate Users
//     for (const user of users) {
//       await neonDb.user.upsert({
//         where: { id: user.id },
//         update: user,
//         create: user,
//       });
//     }
//     console.log("👤 Users migrated successfully.");

//     // Migrate Listings
//     for (const listing of listings) {
//       await neonDb.listing.upsert({
//         where: { id: listing.id },
//         update: listing,
//         create: listing,
//       });
//     }
//     console.log("📦 Listings migrated successfully.");

//     // Migrate Bookings
//     for (const booking of bookings) {
//       await neonDb.booking.upsert({
//         where: { id: booking.id },
//         update: booking,
//         create: booking,
//       });
//     }
//     console.log("📋 Bookings migrated successfully.");

//     // Migrate Reviews
//     for (const review of reviews) {
//       await neonDb.review.upsert({
//         where: { id: review.id },
//         update: review,
//         create: review,
//       });
//     }
//     console.log("⭐ Reviews migrated successfully.");

//     // Migrate Chats if available
//     if (chats.length > 0) {
//       for (const chat of chats) {
//         await (neonDb as any).chat.upsert({
//           where: { id: chat.id },
//           update: chat,
//           create: chat,
//         });
//       }
//       console.log("💬 Chats migrated successfully.");
//     }

//     console.log("✨ ALL LOCAL DATA SUCCESSFULLY MIGRATED TO NEON! 🎉");
//   } catch (error) {
//     console.error("❌ Migration error during insert:", error);
//   } finally {
//     await neonDb.$disconnect();
//     await neonPool.end();
//   }
// }

// migrateData();
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

async function migrateData() {
  console.log("🚀 Starting data transfer from local PostgreSQL to Neon...");

  const localConnectionString = "postgresql://postgres:Letif7327@localhost:5432/ethio_services_db?schema=public";
  
  const localPool = new Pool({ connectionString: localConnectionString });
  const localAdapter = new PrismaPg(localPool);
  const localDb = new PrismaClient({ adapter: localAdapter });

  console.log("📥 Reading all data from local database...");
  
  // Fetch all entities including categories if they exist
  const users = await localDb.user.findMany();
  
  let categories: any[] = [];
  try {
    categories = await (localDb as any).category?.findMany() || [];
  } catch (e) {
    console.log("ℹ️ No category table found.");
  }

  const listings = await localDb.listing.findMany();
  const bookings = await localDb.booking.findMany();
  const reviews = await localDb.review.findMany();
  
  let chats: any[] = [];
  try {
    chats = await (localDb as any).chat?.findMany() || await (localDb as any).message?.findMany() || [];
  } catch (e) {
    console.log("ℹ️ No chat table found.");
  }

  console.log(`Found: ${users.length} users, ${categories.length} categories, ${listings.length} listings, ${bookings.length} bookings, ${reviews.length} reviews, ${chats.length} chats.`);
  
  await localDb.$disconnect();
  await localPool.end();

  const neonConnectionString = "postgresql://neondb_owner:npg_c4athI7lUinq@ep-billowing-sky-axwmuo0h-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=verify-full";

  const neonPool = new Pool({ connectionString: neonConnectionString });
  const neonAdapter = new PrismaPg(neonPool);
  const neonDb = new PrismaClient({ adapter: neonAdapter });

  try {
    console.log("☁️ Inserting data into Neon cloud database in correct order...");

    // 1. Migrate Users first
    for (const user of users) {
      await neonDb.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }
    console.log("👤 Users migrated successfully.");

    // 2. Migrate Categories next (if any)
    if (categories.length > 0) {
      for (const cat of categories) {
        await (neonDb as any).category.upsert({
          where: { id: cat.id },
          update: cat,
          create: cat,
        });
      }
      console.log("🏷️ Categories migrated successfully.");
    }

    // 3. Migrate Listings
    for (const listing of listings) {
      await neonDb.listing.upsert({
        where: { id: listing.id },
        update: listing,
        create: listing,
      });
    }
    console.log("📦 Listings migrated successfully.");

    // 4. Migrate Bookings
    for (const booking of bookings) {
      await neonDb.booking.upsert({
        where: { id: booking.id },
        update: booking,
        create: booking,
      });
    }
    console.log("📋 Bookings migrated successfully.");

    // 5. Migrate Reviews
    for (const review of reviews) {
      await neonDb.review.upsert({
        where: { id: review.id },
        update: review,
        create: review,
      });
    }
    console.log("⭐ Reviews migrated successfully.");

    // 6. Migrate Chats
    if (chats.length > 0) {
      const modelName = (neonDb as any).chat ? 'chat' : 'message';
      for (const chat of chats) {
        await (neonDb as any)[modelName].upsert({
          where: { id: chat.id },
          update: chat,
          create: chat,
        });
      }
      console.log("💬 Chats migrated successfully.");
    }

    console.log("✨ ALL LOCAL DATA SUCCESSFULLY MIGRATED TO NEON! 🎉");
  } catch (error) {
    console.error("❌ Migration error during insert:", error);
  } finally {
    await neonDb.$disconnect();
    await neonPool.end();
  }
}

migrateData();