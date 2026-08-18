// backend/src/routes/users.ts
import { Router, Request, Response } from "express";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";

const router = Router();

// PATCH /api/users/:id - Update profile details & password
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, currentPassword, newPassword } = req.body;

    // Explicitly select passwordHash so bcrypt can verify it
    const user = await (prisma as any).user.findUnique({ 
      where: { id },
      select: { id: true, passwordHash: true, fullName: true, phoneNumber: true }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updateData: any = {};
    if (fullName) updateData.fullName = String(fullName).trim();
    if (phoneNumber) updateData.phoneNumber = String(phoneNumber).trim();

    // If changing password, verify current password first
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        res.status(400).json({ error: "Current password is required to set a new password." });
        return;
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!passwordMatch) {
        res.status(400).json({ error: "Incorrect current password." });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(newPassword.trim(), salt);
    }

    const updatedUser = await (prisma as any).user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// PATCH /api/users/:id/role - Switch user role (Customer <-> Provider)
router.patch("/:id/role", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["CUSTOMER", "PROVIDER"].includes(role)) {
      res.status(400).json({ error: "Invalid role specified." });
      return;
    }

    const updatedUser = await (prisma as any).user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Role update error:", err);
    res.status(500).json({ error: "Failed to update role." });
  }
});

export default router;