import express from "express";
import multer from "multer";
import { analyzeImage } from "../controllers/aiController.js";

const router = express.Router();

const upload = multer();

router.post("/analyze-image", upload.single("image"), analyzeImage);

export default router;