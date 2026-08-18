// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import prisma from "../config/db.js";
// import { normalizeEthiopianPhone } from "../utils/phone.js";

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { phoneNumber, fullName, password, role } = req.body;

//     if (!phoneNumber || !fullName || !password) {
//       res.status(400).json({ error: "Phone number, full name, and password are required." });
//       return;
//     }

//     const formattedPhone = normalizeEthiopianPhone(phoneNumber);
//     if (!formattedPhone) {
//       res.status(400).json({ error: "Invalid Ethiopian phone number. Use 09..., 07..., or +251..." });
//       return;
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { phoneNumber: formattedPhone },
//     });

//     if (existingUser) {
//       res.status(409).json({ error: "An account with this phone number already exists." });
//       return;
//     }

//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);

//     const user = await prisma.user.create({
//       data: {
//         phoneNumber: formattedPhone,
//         fullName,
//         passwordHash,
//         role: role === "PROVIDER" ? "PROVIDER" : "CUSTOMER",
//       },
//       select: {
//         id: true,
//         phoneNumber: true,
//         fullName: true,
//         role: true,
//         createdAt: true,
//       },
//     });

//     const jwtSecret = process.env.JWT_SECRET || "default_secret";
//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       jwtSecret,
//       { expiresIn: "30d" }
//     );

//     res.status(201).json({ user, token });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { phoneNumber, password } = req.body;

//     if (!phoneNumber || !password) {
//       res.status(400).json({ error: "Phone number and password are required." });
//       return;
//     }

//     const formattedPhone = normalizeEthiopianPhone(phoneNumber);
//     if (!formattedPhone) {
//       res.status(400).json({ error: "Invalid Ethiopian phone format." });
//       return;
//     }

//     const user = await prisma.user.findUnique({
//       where: { phoneNumber: formattedPhone },
//     });

//     if (!user) {
//       res.status(401).json({ error: "Invalid phone number or password." });
//       return;
//     }

//     const isValidPassword = await bcrypt.compare(password, user.passwordHash);
//     if (!isValidPassword) {
//       res.status(401).json({ error: "Invalid phone number or password." });
//       return;
//     }

//     const jwtSecret = process.env.JWT_SECRET || "default_secret";
//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       jwtSecret,
//       { expiresIn: "30d" }
//     );

//     res.status(200).json({
//       user: {
//         id: user.id,
//         phoneNumber: user.phoneNumber,
//         fullName: user.fullName,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { normalizeEthiopianPhone } from "../utils/phone.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, fullName, password, role } = req.body;

    if (!phoneNumber || !fullName || !password) {
      res.status(400).json({ error: "Phone number, full name, and password are required." });
      return;
    }

    const formattedPhone = normalizeEthiopianPhone(phoneNumber);
    if (!formattedPhone) {
      res.status(400).json({ error: "Invalid Ethiopian phone number. Use 09..., 07..., or +251..." });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: formattedPhone },
    });

    if (existingUser) {
      res.status(409).json({ error: "An account with this phone number already exists." });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        phoneNumber: formattedPhone,
        fullName,
        passwordHash,
        role: role === "PROVIDER" ? "PROVIDER" : "CUSTOMER",
      },
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, userId: user.id, role: user.role, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      res.status(400).json({ error: "Phone number and password are required." });
      return;
    }

    const formattedPhone = normalizeEthiopianPhone(phoneNumber);
    console.log(`[LOGIN ATTEMPT] Raw: "${phoneNumber}" -> Formatted: "${formattedPhone}"`);

    if (!formattedPhone) {
      res.status(400).json({ error: "Invalid Ethiopian phone format." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { phoneNumber: formattedPhone },
    });

    if (!user) {
      console.log(`[LOGIN FAILED] User not found with phone: "${formattedPhone}"`);
      res.status(401).json({ error: "Invalid phone number or password." });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    console.log(`[LOGIN BCRYPT] Password match result: ${isValidPassword}`);

    if (!isValidPassword) {
      console.log(`[LOGIN FAILED] Password mismatch for user: "${formattedPhone}"`);
      res.status(401).json({ error: "Invalid phone number or password." });
      return;
    }

    const token = jwt.sign(
      { id: user.id, userId: user.id, role: user.role, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log(`[LOGIN SUCCESS] ${user.fullName} (${user.role}) logged in.`);

    res.status(200).json({
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};