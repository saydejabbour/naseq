import express from "express";
import { register, login, forgotPassword } from "../controllers/authController.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", register);

// ✅ LOGIN
router.post("/login", login);

// ✅ FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

export default router;