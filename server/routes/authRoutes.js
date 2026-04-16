import express from "express";
import { register, login, forgotPassword, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", register);

// ✅ LOGIN
router.post("/login", login);

// ✅ FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// 🔥 VERIFY EMAIL (NEW)
router.get("/verify/:token", verifyEmail);

export default router;