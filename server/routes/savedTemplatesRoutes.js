import express from "express";
import { saveTemplate } from "../controllers/savedTemplatesController.js";

const router = express.Router();

router.post("/", saveTemplate);

export default router;