// backend/src/routes/reviews.ts
import { Router, Request, Response } from "express";
import prisma from "../config/db.js";

const router = Router();

// POST /api/reviews - Submit a review for a completed booking
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, customerId, rating, comment } = req.body;

    if (!bookingId || !customerId || !rating) {
      res.status(400).json({ error: "bookingId, customerId, and rating are required." });
      return;
    }

    const numRating = parseInt(String(rating), 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({ error: "Rating must be an integer between 1 and 5." });
      return;
    }

    // 1. Verify booking exists and is COMPLETED
    const booking = await prisma.booking.findUnique({
      where: { id: String(bookingId) },
      include: { review: true },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found." });
      return;
    }

    if (booking.customerId !== String(customerId)) {
      res.status(403).json({ error: "You can only review your own bookings." });
      return;
    }

    if (booking.status !== "COMPLETED") {
      res.status(400).json({ error: "Reviews can only be submitted for COMPLETED jobs." });
      return;
    }

    if (booking.review) {
      res.status(409).json({ error: "You have already submitted a review for this booking." });
      return;
    }

    // 2. Create review
    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        customerId: String(customerId),
        listingId: booking.listingId,
        rating: numRating,
        comment: comment ? String(comment).trim() : null,
      },
      include: {
        customer: {
          select: { id: true, fullName: true },
        },
      },
    });

    console.log(`[REVIEW CREATED] ⭐ ${numRating}/5 for listing ${booking.listingId}`);
    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Failed to submit review." });
  }
});

// GET /api/reviews/listing/:listingId - Fetch all reviews & average score for a listing
router.get("/listing/:listingId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { listingId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { listingId: String(listingId) },
      include: {
        customer: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    res.json({
      averageRating: parseFloat(avgRating.toFixed(1)),
      totalReviews,
      reviews,
    });
  } catch (error) {
    console.error("Fetch listing reviews error:", error);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

export default router;