import express from "express";
import {
  upload,
  addItem,
  getUserItems,
  deleteItem,
} from "../controllers/clothingController.js";
import db from "../config/db.js";

const router = express.Router();

/* ADD CLOTHING ITEM */
router.post("/add", upload.single("image"), addItem);

/* GET USER CLOTHING ITEMS */
router.get("/user/:user_id", getUserItems);

/* GET ALL CATEGORIES WITH ITEM COUNT */
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        c.category_id,
        c.name,
        c.description,
        c.is_active,
        COUNT(ci.item_id) AS item_count
       FROM categories c
       LEFT JOIN clothing_items ci ON c.category_id = ci.category_id
       GROUP BY c.category_id, c.name, c.description, c.is_active
       ORDER BY c.category_id ASC`
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: err.message,
    });
  }
});

/* ADD CATEGORY */
router.post("/categories", async (req, res) => {
  try {
    const { name, description, is_active } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    await db.promise().query(
      `INSERT INTO categories (name, description, is_active)
       VALUES (?, ?, ?)`,
      [name.trim(), description || "", is_active ? 1 : 0]
    );

    return res.json({
      success: true,
      message: "Category added successfully",
    });
  } catch (err) {
    console.error("ADD CATEGORY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: err.message,
    });
  }
});

/* UPDATE CATEGORY */
router.put("/categories/:category_id", async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name, description, is_active } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    await db.promise().query(
      `UPDATE categories
       SET name = ?, description = ?, is_active = ?
       WHERE category_id = ?`,
      [name.trim(), description || "", is_active ? 1 : 0, category_id]
    );

    return res.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (err) {
    console.error("UPDATE CATEGORY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: err.message,
    });
  }
});

/* DELETE CATEGORY */
router.delete("/categories/:category_id", async (req, res) => {
  try {
    const { category_id } = req.params;

    await db.promise().query(
      `DELETE FROM categories WHERE category_id = ?`,
      [category_id]
    );

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("DELETE CATEGORY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: err.message,
    });
  }
});

/* DELETE CLOTHING ITEM */
router.delete("/:item_id", deleteItem);

export default router;