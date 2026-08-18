
// import { Router, Request, Response } from "express";
// import prisma from "../config/db.js";

// const router = Router();

// // GET /api/chats/:bookingId
// router.get("/:bookingId", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { bookingId } = req.params;
//     const messages = await (prisma as any).chatMessage.findMany({
//       where: { bookingId: String(bookingId) },
//       orderBy: { createdAt: "asc" },
//     });
//     res.json(messages);
//   } catch (err) {
//     console.error("Error fetching messages:", err);
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// });

// // POST /api/chats/:bookingId
// router.post("/:bookingId", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { bookingId } = req.params;
//     const { senderId, senderName, text } = req.body;

//     if (!text || !senderId) {
//       res.status(400).json({ error: "Missing text or sender ID" });
//       return;
//     }

//     const newMessage = await (prisma as any).chatMessage.create({
//       data: {
//         bookingId: String(bookingId),
//         senderId: String(senderId),
//         senderName: senderName ? String(senderName) : "User",
//         text: String(text).trim(),
//       },
//     });

//     res.status(201).json(newMessage);
//   } catch (err) {
//     console.error("Error saving message:", err);
//     res.status(500).json({ error: "Failed to send message" });
//   }
// });

// export default router;
// backend/src/routes/chats.ts
import { Router, Request, Response } from "express";
import prisma from "../config/db.js";

const router = Router();

// GET messages for booking
router.get("/:bookingId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const messages = await (prisma as any).chatMessage.findMany({
      where: { bookingId: String(bookingId) },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST message for booking
router.post("/:bookingId", async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { senderId, senderName, text } = req.body;

    if (!text || !senderId) {
      res.status(400).json({ error: "Missing text or sender ID" });
      return;
    }

    const newMessage = await (prisma as any).chatMessage.create({
      data: {
        bookingId: String(bookingId),
        senderId: String(senderId),
        senderName: senderName ? String(senderName) : "User",
        text: String(text).trim(),
      },
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;