
// import express, { Request, Response } from "express";
// import cors from "cors";
// import "dotenv/config";
// import authRoutes from "./routes/auth.routes";
// import listingsRouter from "./routes/listings";
// import bookingsRouter from "./routes/bookings";
// import paymentsRouter from "./routes/payments.js";

// // Inside server setup:

// import prisma from "./config/db";

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/listings", listingsRouter);
// app.use("/api/bookings", bookingsRouter);
// app.use("/api/payments", paymentsRouter);
// // Categories listing endpoint
// app.get("/api/categories", async (_req: Request, res: Response): Promise<void> => {
//   try {
//     const categories = await prisma.category.findMany();
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch categories" });
//   }
// });

// // Health check endpoint
// app.get("/api/health", (_req: Request, res: Response): void => {
//   res.json({ status: "ok", timestamp: new Date().toISOString() });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Express server running on http://localhost:${PORT}`);
// });
// backend/src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

// Database
import prisma from "./config/db";

// Route Handlers
import authRoutes from "./routes/auth.routes";
import listingsRouter from "./routes/listings";
import bookingsRouter from "./routes/bookings";
import paymentsRouter from "./routes/payments";
import reviewsRouter from "./routes/reviews.js";
import chatRoutes from "./routes/chats.js";
import userRoutes from "./routes/users.js";
const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);
// Categories listing endpoint
app.get("/api/categories", async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { nameEn: "asc" },
    });
    res.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response): void => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});