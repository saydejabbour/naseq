import express from "express";
import {
  createOutfit,
  addItemToOutfit,
  getOutfits,
} from "../controllers/outfitController.js";

const router = express.Router();

router.post("/create", createOutfit);
router.post("/add-item", addItemToOutfit);
router.get("/:user_id", getOutfits);

export default router;