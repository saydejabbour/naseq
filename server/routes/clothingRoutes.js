import express from "express";
import {
  addItem,
  getItems,
  deleteItem,
} from "../controllers/clothingController.js";

const router = express.Router();

router.post("/add", addItem);
router.get("/:user_id", getItems);
router.delete("/:item_id", deleteItem);

export default router;