// // backend/src/routes/payments.ts
// import { Router, Request, Response } from "express";
// import prisma from "../config/db.js";

// const router = Router();

// interface ChapaInitResponse {
//   message: string;
//   status: string;
//   data?: {
//     checkout_url: string;
//   };
// }

// interface ChapaVerifyResponse {
//   message: string;
//   status: string;
//   data?: {
//     reference?: string;
//     status?: string;
//     amount?: number;
//   };
// }

// // POST /api/payments/initialize - Start Chapa Transaction
// router.post("/initialize", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const bookingId = String(req.body.bookingId || "");
//     if (!bookingId) {
//       res.status(400).json({ error: "bookingId is required" });
//       return;
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: { customer: true, listing: true },
//     });

//     if (!booking) {
//       res.status(404).json({ error: "Booking not found" });
//       return;
//     }

//     const txRef: string = `ethio-service-${booking.id}-${Date.now()}`;
//     const amount = Number(booking.totalAmount);
//     const email: string =
//       booking.customer.email ||
//       `user_${booking.customer.id.substring(0, 6)}@ethioservices.et`;
//     const [firstName, ...lastNameParts] = booking.customer.fullName.split(" ");
//     const lastName: string = lastNameParts.join(" ") || "Customer";

//     const chapaPayload = {
//       amount: amount.toString(),
//       currency: "ETB",
//       email: email,
//       first_name: firstName,
//       last_name: lastName,
//       phone_number: booking.customer.phoneNumber,
//       tx_ref: txRef,
//       callback_url: `http://localhost:5000/api/payments/verify/${txRef}`,
//       return_url: `http://localhost:8081/bookings?payment=success&bookingId=${booking.id}`,
//       "customization[title]": "Ethio Services Payment",
//       "customization[description]": `Payment for ${booking.listing.title}`,
//     };

//     const chapaSecretKey =
//       process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-xxxxxxxxxxxxxxxxxxxxx";

//     const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${chapaSecretKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(chapaPayload),
//     });

//     const chapaData = (await chapaResponse.json()) as ChapaInitResponse;

//     if (chapaData.status !== "success" || !chapaData.data?.checkout_url) {
//       console.error("Chapa initialization error:", chapaData);
//       res.status(400).json({
//         error: chapaData.message || "Failed to initialize Chapa payment",
//       });
//       return;
//     }

//     // Save or update payment record in DB with strictly typed txRef
//     await prisma.payment.upsert({
//       where: { bookingId: booking.id },
//       update: {
//         amountBirr: amount,
//         txRef: txRef,
//         status: "PENDING",
//       },
//       create: {
//         bookingId: booking.id,
//         amountBirr: amount,
//         currency: "ETB",
//         status: "PENDING",
//         method: "CHAPA",
//         txRef: txRef,
//       },
//     });

//     res.json({
//       checkout_url: chapaData.data.checkout_url,
//       txRef,
//     });
//   } catch (error) {
//     console.error("Payment initialization error:", error);
//     res.status(500).json({ error: "Internal server error during payment initialization" });
//   }
// });

// // GET /api/payments/verify/:txRef - Verify Chapa Transaction
// router.get("/verify/:txRef", async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Explicitly normalize txRef parameter to a single string
//     const rawTxRef = req.params.txRef;
//     const txRef: string = Array.isArray(rawTxRef) ? rawTxRef[0] : String(rawTxRef || "");

//     if (!txRef) {
//       res.status(400).send("Transaction reference missing");
//       return;
//     }

//     const chapaSecretKey = process.env.CHAPA_SECRET_KEY || "";

//     const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
//       headers: {
//         Authorization: `Bearer ${chapaSecretKey}`,
//       },
//     });

//     const verifyData = (await verifyRes.json()) as ChapaVerifyResponse;

//     if (verifyData.status === "success") {
//       const payment = await prisma.payment.update({
//         where: { txRef: txRef },
//         data: {
//           status: "SUCCESS",
//           chapaRef: verifyData.data?.reference || null,
//         },
//       });

//       await prisma.booking.update({
//         where: { id: payment.bookingId },
//         data: { status: "CONFIRMED" },
//       });

//       res.redirect("http://localhost:8081/bookings?payment=success");
//     } else {
//       await prisma.payment.update({
//         where: { txRef: txRef },
//         data: { status: "FAILED" },
//       });
//       res.redirect("http://localhost:8081/bookings?payment=failed");
//     }
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     res.status(500).send("Verification error");
//   }
// });

// export default router;
// backend/src/routes/payments.ts
import { Router, Request, Response } from "express";
import prisma from "../config/db.js";

const router = Router();

// POST /api/payments/initialize - Start Chapa Transaction
router.post("/initialize", async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = String(req.body.bookingId || "");
    if (!bookingId) {
      res.status(400).json({ error: "bookingId is required" });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, listing: true },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    // Unique transaction reference
    const txRef: string = `ethio-${booking.id.slice(0, 8)}-${Date.now()}`;
    const amount = Number(booking.totalAmount);
    
    // Ensure email is a valid email string for Chapa validation
    const rawEmail = booking.customer.email?.trim();
    const email: string = (rawEmail && rawEmail.includes("@")) 
      ? rawEmail 
      : `customer_${booking.customer.phoneNumber.replace(/[^0-9]/g, "") || "user"}@ethioservices.com`;

    const nameParts = (booking.customer.fullName || "Customer User").trim().split(" ");
    const firstName: string = nameParts[0] || "Customer";
    const lastName: string = nameParts.slice(1).join(" ") || "User";

    const chapaPayload = {
      amount: amount.toString(),
      currency: "ETB",
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: booking.customer.phoneNumber,
      tx_ref: txRef,
      callback_url: `http://localhost:5000/api/payments/verify/${txRef}`,
      return_url: `http://localhost:8081/bookings?payment=success&bookingId=${booking.id}`,
      "customization[title]": "Ethio Services Payment",
      "customization[description]": `Payment for ${booking.listing.title}`,
    };

    const chapaSecretKey =
      process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-xxxxxxxxxxxxxxxxxxxxx";

    const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chapaSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapaPayload),
    });

    const chapaData = (await chapaResponse.json()) as any;

    if (chapaData.status !== "success" || !chapaData.data?.checkout_url) {
      console.error("Chapa initialization error from API:", chapaData);
      
      // Convert object errors (like { email: [...], tx_ref: [...] }) into readable string
      let errorMessage = "Failed to initialize Chapa payment";
      if (typeof chapaData.message === "string") {
        errorMessage = chapaData.message;
      } else if (typeof chapaData.message === "object" && chapaData.message !== null) {
        errorMessage = Object.entries(chapaData.message)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
      }

      res.status(400).json({ error: errorMessage });
      return;
    }

    // Save or update payment record in DB
    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        amountBirr: amount,
        txRef: txRef,
        status: "PENDING",
      },
      create: {
        bookingId: booking.id,
        amountBirr: amount,
        currency: "ETB",
        status: "PENDING",
        method: "CHAPA",
        txRef: txRef,
      },
    });

    res.json({
      checkout_url: chapaData.data.checkout_url,
      txRef,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({ error: "Internal server error during payment initialization" });
  }
});

// GET /api/payments/verify/:txRef - Verify Chapa Transaction
router.get("/verify/:txRef", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawTxRef = req.params.txRef;
    const txRef: string = Array.isArray(rawTxRef) ? rawTxRef[0] : String(rawTxRef || "");

    if (!txRef) {
      res.status(400).send("Transaction reference missing");
      return;
    }

    const chapaSecretKey = process.env.CHAPA_SECRET_KEY || "";

    const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      headers: {
        Authorization: `Bearer ${chapaSecretKey}`,
      },
    });

    const verifyData = (await verifyRes.json()) as any;

    if (verifyData.status === "success") {
      const payment = await prisma.payment.update({
        where: { txRef: txRef },
        data: {
          status: "SUCCESS",
          chapaRef: verifyData.data?.reference || null,
        },
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "CONFIRMED" },
      });

      res.redirect("http://localhost:8081/bookings?payment=success");
    } else {
      await prisma.payment.update({
        where: { txRef: txRef },
        data: { status: "FAILED" },
      });
      res.redirect("http://localhost:8081/bookings?payment=failed");
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).send("Verification error");
  }
});

export default router;