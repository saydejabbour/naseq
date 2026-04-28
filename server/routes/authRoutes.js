import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyEmail,
} from "../controllers/authController.js";

// 🔥 IMPORT YOUR NEW FUNCTION
import { createTemplate } from "../controllers/stylistController.js";

const router = express.Router();

// ✅ AUTH ROUTES
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/verify/:token", verifyEmail);

// 🔥 ADD THIS (VERY IMPORTANT)
router.post("/stylist/templates", createTemplate);

export default router;