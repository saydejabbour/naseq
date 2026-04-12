import express from "express";
import {
  upload,
  addItem,
  getUserItems,
  deleteItem,
} from "../controllers/clothingController.js";

const router = express.Router();

// POST /api/clothing/add  — multipart/form-data with field name "image"
router.post("/add", upload.single("image"), addItem);

// GET /api/clothing/user/:user_id
router.get("/user/:user_id", getUserItems);

// DELETE /api/clothing/:item_id
router.delete("/:item_id", deleteItem);

export default router;