
// import { Router, Request, Response } from "express";
// import { SubCity } from "@prisma/client";
// import prisma from "../config/db.js";

// const router = Router();

// // SubCity normalization mapping for Addis Ababa
// const SUBCITY_ENUM_MAP: Record<string, SubCity> = {
//   BOLE: "BOLE" as SubCity,
//   YEKA: "YEKA" as SubCity,
//   ARADA: "ARADA" as SubCity,
//   KIRKOS: "KIRKOS" as SubCity,
//   LIDETA: "LIDETA" as SubCity,
//   "NIFAS SILK": "NIFAS_SILK_LAFTO" as SubCity,
//   NIFAS_SILK: "NIFAS_SILK_LAFTO" as SubCity,
//   NIFAS_SILK_LAFTO: "NIFAS_SILK_LAFTO" as SubCity,
//   "KOLFE KERANIO": "KOLFE_KERANIO" as SubCity,
//   KOLFE_KERANIO: "KOLFE_KERANIO" as SubCity,
//   GULLELE: "GULLELE" as SubCity,
//   "AKAKY KALITI": "AKAKY_KALITI" as SubCity,
//   AKAKY_KALITI: "AKAKY_KALITI" as SubCity,
//   "ADDIS KETEMA": "ADDIS_KETEMA" as SubCity,
//   ADDIS_KETEMA: "ADDIS_KETEMA" as SubCity,
//   "LEMI KURA": "LEMI_KURA" as SubCity,
//   LEMI_KURA: "LEMI_KURA" as SubCity,
// };

// // GET /api/listings - Retrieve listings with optional filters
// router.get("/", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { subcity, subCity, categoryId, providerId, search } = req.query;

//     const where: any = {};

//     // Support both ?subcity= and ?subCity=
//     const rawSubcity = subcity || subCity;
//     if (rawSubcity && rawSubcity !== "ALL") {
//       const normalizedKey = String(rawSubcity).trim().toUpperCase();
//       const enumVal = SUBCITY_ENUM_MAP[normalizedKey] || (normalizedKey.replace(/\s+/g, "_") as SubCity);
//       where.subCity = enumVal;
//     }

//     if (categoryId && categoryId !== "ALL") {
//       where.categoryId = String(categoryId);
//     }

//     if (providerId) {
//       where.providerId = String(providerId);
//     }

//     if (search && String(search).trim()) {
//       const term = String(search).trim();
//       where.OR = [
//         { title: { contains: term, mode: "insensitive" } },
//         { titleAm: { contains: term, mode: "insensitive" } },
//         { description: { contains: term, mode: "insensitive" } },
//         { specificArea: { contains: term, mode: "insensitive" } },
//       ];
//     }

//     const listings = await prisma.listing.findMany({
//       where,
//       include: {
//         category: true,
//         provider: {
//           select: {
//             id: true,
//             fullName: true,
//             phoneNumber: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.json(listings);
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     res.status(500).json({ error: "Failed to fetch listings" });
//   }
// });

// // GET /api/listings/:id - Fetch single listing details
// router.get("/:id", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const listing = await prisma.listing.findUnique({
//       where: { id: String(id) },
//       include: {
//         category: true,
//         provider: {
//           select: {
//             id: true,
//             fullName: true,
//             phoneNumber: true,
//           },
//         },
//       },
//     });

//     if (!listing) {
//       res.status(404).json({ error: "Service listing not found." });
//       return;
//     }

//     res.json(listing);
//   } catch (error) {
//     console.error("Error fetching listing details:", error);
//     res.status(500).json({ error: "Failed to fetch listing details." });
//   }
// });

// // POST /api/listings - Create new service listing (Provider only)
// router.post("/", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const {
//       providerId,
//       categoryId,
//       title,
//       titleAm,
//       description,
//       priceBirr,
//       subCity,
//       specificArea,
//       images,
//     } = req.body;

//     if (!providerId || !categoryId || !title || !description || priceBirr === undefined || !subCity) {
//       res.status(400).json({
//         error: "providerId, categoryId, title, description, priceBirr, and subCity are required.",
//       });
//       return;
//     }

//     // Resolve & cast SubCity enum safely
//     const normalizedKey = String(subCity).trim().toUpperCase();
//     const resolvedSubCity = (SUBCITY_ENUM_MAP[normalizedKey] ||
//       normalizedKey.replace(/\s+/g, "_")) as SubCity;

//     // Verify provider exists and has PROVIDER role
//     const provider = await prisma.user.findUnique({
//       where: { id: String(providerId) },
//     });

//     if (!provider || provider.role !== "PROVIDER") {
//       res.status(403).json({ error: "Only verified providers can create service listings." });
//       return;
//     }

//     const listing = await prisma.listing.create({
//       data: {
//         providerId: String(providerId),
//         categoryId: String(categoryId),
//         title: String(title).trim(),
//         titleAm: titleAm ? String(titleAm).trim() : null,
//         description: String(description).trim(),
//         priceBirr: parseFloat(String(priceBirr)),
//         subCity: resolvedSubCity,
//         specificArea: specificArea ? String(specificArea).trim() : "Addis Ababa",
//         images: Array.isArray(images) ? images : [],
//         isVerified: true,
//       },
//       include: {
//         category: true,
//         provider: {
//           select: {
//             id: true,
//             fullName: true,
//             phoneNumber: true,
//           },
//         },
//       },
//     });

//     console.log(`[LISTING CREATED] "${listing.title}" by provider ${provider.fullName}`);
//     res.status(201).json(listing);
//   } catch (error) {
//     console.error("Listing creation error:", error);
//     res.status(500).json({ error: "Failed to create listing." });
//   }
// });

// // DELETE /api/listings/:id - Delete listing
// router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { providerId } = req.body;

//     const listing = await prisma.listing.findUnique({
//       where: { id: String(id) },
//     });

//     if (!listing) {
//       res.status(404).json({ error: "Listing not found." });
//       return;
//     }

//     if (providerId && listing.providerId !== String(providerId)) {
//       res.status(403).json({ error: "Unauthorized to delete this listing." });
//       return;
//     }

//     await prisma.listing.delete({
//       where: { id: String(id) },
//     });

//     res.json({ message: "Listing deleted successfully." });
//   } catch (error) {
//     console.error("Delete listing error:", error);
//     res.status(500).json({ error: "Failed to delete listing." });
//   }
// });

// export default router;
// backend/src/routes/listings.ts
import { Router, Request, Response } from "express";
import { SubCity } from "@prisma/client";
import prisma from "../config/db.js";

const router = Router();

// SubCity normalization mapping for Addis Ababa
const SUBCITY_ENUM_MAP: Record<string, SubCity> = {
  BOLE: "BOLE" as SubCity,
  YEKA: "YEKA" as SubCity,
  ARADA: "ARADA" as SubCity,
  KIRKOS: "KIRKOS" as SubCity,
  LIDETA: "LIDETA" as SubCity,
  "NIFAS SILK": "NIFAS_SILK_LAFTO" as SubCity,
  NIFAS_SILK: "NIFAS_SILK_LAFTO" as SubCity,
  NIFAS_SILK_LAFTO: "NIFAS_SILK_LAFTO" as SubCity,
  "KOLFE KERANIO": "KOLFE_KERANIO" as SubCity,
  KOLFE_KERANIO: "KOLFE_KERANIO" as SubCity,
  GULLELE: "GULLELE" as SubCity,
  "AKAKY KALITI": "AKAKY_KALITI" as SubCity,
  AKAKY_KALITI: "AKAKY_KALITI" as SubCity,
  "ADDIS KETEMA": "ADDIS_KETEMA" as SubCity,
  ADDIS_KETEMA: "ADDIS_KETEMA" as SubCity,
  "LEMI KURA": "LEMI_KURA" as SubCity,
  LEMI_KURA: "LEMI_KURA" as SubCity,
};

// GET /api/listings - Retrieve listings with search, subcity, category, and live review metrics
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { subcity, subCity, categoryId, providerId, search } = req.query;

    const where: any = {};

    // Support both ?subcity= and ?subCity=
    const rawSubcity = subcity || subCity;
    if (rawSubcity && rawSubcity !== "ALL") {
      const normalizedKey = String(rawSubcity).trim().toUpperCase();
      const enumVal = SUBCITY_ENUM_MAP[normalizedKey] || (normalizedKey.replace(/\s+/g, "_") as SubCity);
      where.subCity = enumVal;
    }

    if (categoryId && categoryId !== "ALL") {
      where.categoryId = String(categoryId);
    }

    if (providerId) {
      where.providerId = String(providerId);
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { titleAm: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { specificArea: { contains: term, mode: "insensitive" } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Compute live averageRating and reviewCount for each listing
    const formattedListings = listings.map((item) => {
      const totalReviews = item.reviews.length;
      const avgRating =
        totalReviews > 0
          ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      return {
        ...item,
        averageRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: totalReviews,
      };
    });

    res.json(formattedListings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// GET /api/listings/:id - Fetch single listing details with complete reviews
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id: String(id) },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!listing) {
      res.status(404).json({ error: "Service listing not found." });
      return;
    }

    const totalReviews = listing.reviews.length;
    const avgRating =
      totalReviews > 0
        ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    res.json({
      ...listing,
      averageRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: totalReviews,
    });
  } catch (error) {
    console.error("Error fetching listing details:", error);
    res.status(500).json({ error: "Failed to fetch listing details." });
  }
});

// POST /api/listings - Create new service listing (Provider only)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      providerId,
      categoryId,
      title,
      titleAm,
      description,
      priceBirr,
      subCity,
      specificArea,
      images,
    } = req.body;

    if (!providerId || !categoryId || !title || !description || priceBirr === undefined || !subCity) {
      res.status(400).json({
        error: "providerId, categoryId, title, description, priceBirr, and subCity are required.",
      });
      return;
    }

    // Resolve & cast SubCity enum safely
    const normalizedKey = String(subCity).trim().toUpperCase();
    const resolvedSubCity = (SUBCITY_ENUM_MAP[normalizedKey] ||
      normalizedKey.replace(/\s+/g, "_")) as SubCity;

    // Verify provider exists and has PROVIDER role
    const provider = await prisma.user.findUnique({
      where: { id: String(providerId) },
    });

    if (!provider || provider.role !== "PROVIDER") {
      res.status(403).json({ error: "Only verified providers can create service listings." });
      return;
    }

    const listing = await prisma.listing.create({
      data: {
        providerId: String(providerId),
        categoryId: String(categoryId),
        title: String(title).trim(),
        titleAm: titleAm ? String(titleAm).trim() : null,
        description: String(description).trim(),
        priceBirr: parseFloat(String(priceBirr)),
        subCity: resolvedSubCity,
        specificArea: specificArea ? String(specificArea).trim() : "Addis Ababa",
        images: Array.isArray(images) ? images : [],
        isVerified: true,
      },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
          },
        },
        reviews: true,
      },
    });

    console.log(`[LISTING CREATED] "${listing.title}" by provider ${provider.fullName}`);
    res.status(201).json({
      ...listing,
      averageRating: 0,
      reviewCount: 0,
    });
  } catch (error) {
    console.error("Listing creation error:", error);
    res.status(500).json({ error: "Failed to create listing." });
  }
});

// DELETE /api/listings/:id - Delete listing
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { providerId } = req.body;

    const listing = await prisma.listing.findUnique({
      where: { id: String(id) },
    });

    if (!listing) {
      res.status(404).json({ error: "Listing not found." });
      return;
    }

    if (providerId && listing.providerId !== String(providerId)) {
      res.status(403).json({ error: "Unauthorized to delete this listing." });
      return;
    }

    await prisma.listing.delete({
      where: { id: String(id) },
    });

    res.json({ message: "Listing deleted successfully." });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({ error: "Failed to delete listing." });
  }
});

export default router;