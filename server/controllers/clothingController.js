import db from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";

// ADD ITEM
export const addItem = (req, res) => {
  const { user_id, category_id, image_url, color, style, season, occasion } =
    req.body;

  if (!user_id || !category_id) {
    return errorResponse(res, "Missing required fields", 400);
  }

  const query = `
    INSERT INTO clothing_items 
    (user_id, category_id, image_url, color, style, season, occasion)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, category_id, image_url, color, style, season, occasion],
    (err, result) => {
      if (err) return errorResponse(res, "Failed to add item");

      return successResponse(res, "Item added successfully");
    }
  );
};

// GET ALL ITEMS (for a user)
export const getItems = (req, res) => {
  const { user_id } = req.params;

  const query = "SELECT * FROM clothing_items WHERE user_id = ?";

  db.query(query, [user_id], (err, results) => {
    if (err) return errorResponse(res, "Failed to fetch items");

    return successResponse(res, "Items fetched", results);
  });
};

// DELETE ITEM
export const deleteItem = (req, res) => {
  const { item_id } = req.params;

  const query = "DELETE FROM clothing_items WHERE item_id = ?";

  db.query(query, [item_id], (err, result) => {
    if (err) return errorResponse(res, "Failed to delete item");

    return successResponse(res, "Item deleted successfully");
  });
};