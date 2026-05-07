import express from "express";
import multer from "multer";
import { analyzeImage, detectColor } from "../controllers/aiController.js";

const router = express.Router();

const upload = multer();

router.post("/analyze-image", upload.single("image"), analyzeImage);
router.post("/detect-color", upload.single("image"), detectColor);

export default router;