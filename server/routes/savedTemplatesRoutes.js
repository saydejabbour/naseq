import express from "express";
import { saveTemplate, getSavedTemplates } from "../controllers/savedTemplatesController.js";
import { removeSavedTemplate } from "../controllers/savedTemplatesController.js";

const router = express.Router();

router.post("/", saveTemplate);
router.get("/:user_id", getSavedTemplates);
router.delete("/:user_id/:template_id", removeSavedTemplate);

export default router;