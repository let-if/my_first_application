
// import { Router, Request, Response } from "express";
// import prisma from "../config/db";

// const router = Router();

// // POST /api/bookings - Create new service booking
// router.post("/", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { listingId, customerId, bookingDate, notes } = req.body;

//     if (!listingId || !customerId || !bookingDate) {
//       res.status(400).json({ error: "listingId, customerId, and bookingDate are required" });
//       return;
//     }

//     const listing = await prisma.listing.findUnique({
//       where: { id: String(listingId) },
//       include: { provider: true },
//     });

//     if (!listing) {
//       res.status(404).json({ error: "Service listing not found" });
//       return;
//     }

//     const booking = await prisma.booking.create({
//       data: {
//         listingId: String(listingId),
//         customerId: String(customerId),
//         bookingDate: new Date(bookingDate),
//         totalAmount: listing.priceBirr,
//         notes: notes ? String(notes) : null,
//         status: "PENDING",
//       },
//       include: {
//         customer: {
//           select: {
//             id: true,
//             fullName: true,
//             phoneNumber: true,
//             email: true,
//           },
//         },
//         listing: {
//           include: {
//             category: true,
//             provider: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 phoneNumber: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     res.status(201).json(booking);
//   } catch (error) {
//     console.error("Booking error:", error);
//     res.status(500).json({ error: "Failed to create booking" });
//   }
// });

// // GET /api/bookings/my - Fetch customer bookings
// router.get("/my", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { customerId } = req.query;
//     if (!customerId) {
//       res.status(400).json({ error: "customerId is required" });
//       return;
//     }

//     const bookings = await prisma.booking.findMany({
//       where: { customerId: String(customerId) },
//       include: {
//         customer: {
//           select: {
//             id: true,
//             fullName: true,
//             phoneNumber: true,
//             email: true,
//           },
//         },
//         listing: {
//           include: {
//             category: true,
//             provider: {
//               select: {
//                 id: true,
//                 fullName: true,
//                 phoneNumber: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     res.json(bookings);
//   } catch (error) {
//     console.error("Error fetching user bookings:", error);
//     res.status(500).json({ error: "Failed to retrieve bookings" });
//   }
// });

// // GET /api/bookings/provider - Fetch all bookings for a provider's listings
// router.get("/provider", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const rawProviderId = req.query.providerId;
//     const providerId = Array.isArray(rawProviderId)
//       ? rawProviderId[0]
//       : String(rawProviderId || "").trim();

//     if (!providerId || providerId === "undefined" || providerId === "null") {
//       res.status(400).json({ error: "Valid providerId query parameter is required" });
//       return;
//     }

//     const bookings = await prisma.booking.findMany({
//       where: {
//         listing: {
//           providerId: providerId,
//         },
//       },
//       include: {
//         customer: {
//           select: {
//             id: true,
//             fullName: true,
//             phoneNumber: true,
//             email: true,
//           },
//         },
//         listing: {
//           include: {
//             category: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     res.json(bookings);
//   } catch (error) {
//     console.error("Fetch provider bookings error:", error);
//     res.status(500).json({ error: "Failed to fetch provider bookings" });
//   }
// });

// // PATCH /api/bookings/:id/status - Update booking status
// router.patch("/:id/status", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const rawId = req.params.id;
//     const id = Array.isArray(rawId) ? rawId[0] : String(rawId || "");
//     const { status } = req.body;

//     const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
//     if (!validStatuses.includes(status)) {
//       res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
//       return;
//     }

//     const updatedBooking = await prisma.booking.update({
//       where: { id },
//       data: { status },
//       include: {
//         customer: {
//           select: {
//             id: true,
//             fullName: true,
//             phoneNumber: true,
//             email: true,
//           },
//         },
//         listing: {
//           include: {
//             category: true,
//           },
//         },
//       },
//     });

//     res.json(updatedBooking);
//   } catch (error) {
//     console.error("Update booking status error:", error);
//     res.status(500).json({ error: "Failed to update booking status" });
//   }
// });

// export default router;
// backend/src/routes/bookings.ts
import { Router, Request, Response } from "express";
import { BookingStatus } from "@prisma/client";
import prisma from "../config/db.js";

const router = Router();

// POST /api/bookings - Create new service booking
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId, customerId, bookingDate, notes } = req.body;

    if (!listingId || !customerId || !bookingDate) {
      res.status(400).json({ error: "listingId, customerId, and bookingDate are required" });
      return;
    }

    const listing = await prisma.listing.findUnique({
      where: { id: String(listingId) },
      include: { provider: true },
    });

    if (!listing) {
      res.status(404).json({ error: "Service listing not found" });
      return;
    }

    const parsedDate = new Date(bookingDate);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({ error: "Invalid bookingDate format" });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        listingId: String(listingId),
        customerId: String(customerId),
        bookingDate: parsedDate,
        totalAmount: listing.priceBirr,
        notes: notes ? String(notes).trim() : null,
        status: "PENDING",
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        listing: {
          include: {
            category: true,
            provider: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
              },
            },
          },
        },
        review: true,
      },
    });

    console.log(`[BOOKING CREATED] ${booking.id} - ${listing.title} for customer ${customerId}`);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET /api/bookings/my - Fetch customer bookings (including review status)
router.get("/my", async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      res.status(400).json({ error: "customerId query parameter is required" });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId: String(customerId) },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        listing: {
          include: {
            category: true,
            provider: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
              },
            },
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
});

// GET /api/bookings/provider - Fetch all bookings for a provider's listings
router.get("/provider", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawProviderId = req.query.providerId;
    const providerId = Array.isArray(rawProviderId)
      ? rawProviderId[0]
      : String(rawProviderId || "").trim();

    if (!providerId || providerId === "undefined" || providerId === "null") {
      res.status(400).json({ error: "Valid providerId query parameter is required" });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: {
        listing: {
          providerId: providerId,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        listing: {
          include: {
            category: true,
            provider: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
              },
            },
          },
        },
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Fetch provider bookings error:", error);
    res.status(500).json({ error: "Failed to fetch provider bookings" });
  }
});

// GET /api/bookings/:id - Fetch single booking details
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: String(id) },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        listing: {
          include: {
            category: true,
            provider: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
              },
            },
          },
        },
        review: true,
      },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json(booking);
  } catch (error) {
    console.error("Fetch booking details error:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
});

// PATCH /api/bookings/:id/status - Update booking status
router.patch("/:id/status", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status as BookingStatus)) {
      res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: String(id) },
      data: { status: status as BookingStatus },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            email: true,
          },
        },
        listing: {
          include: {
            category: true,
            provider: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
              },
            },
          },
        },
        review: true,
      },
    });

    console.log(`[BOOKING STATUS UPDATED] ${updatedBooking.id} -> ${status}`);
    res.json(updatedBooking);
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

export default router;