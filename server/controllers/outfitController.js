import db from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";

// CREATE OUTFIT
export const createOutfit = (req, res) => {
  const { user_id, name } = req.body;

  if (!user_id || !name) {
    return errorResponse(res, "Missing required fields", 400);
  }

  const query = "INSERT INTO outfits (user_id, name) VALUES (?, ?)";

  db.query(query, [user_id, name], (err, result) => {
    if (err) return errorResponse(res, "Failed to create outfit");

    return successResponse(res, "Outfit created successfully", {
      outfit_id: result.insertId,
    });
  });
};

// ADD ITEM TO OUTFIT
export const addItemToOutfit = (req, res) => {
  const { outfit_id, item_id } = req.body;

  if (!outfit_id || !item_id) {
    return errorResponse(res, "Missing required fields", 400);
  }

  const query =
    "INSERT INTO member_outfit_items (outfit_id, item_id) VALUES (?, ?)";

  db.query(query, [outfit_id, item_id], (err, result) => {
    if (err) return errorResponse(res, "Failed to add item to outfit");

    return successResponse(res, "Item added to outfit");
  });
};

// GET OUTFITS WITH ITEMS
export const getOutfits = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT o.outfit_id, o.name, ci.*
    FROM outfits o
    JOIN member_outfit_items moi ON o.outfit_id = moi.outfit_id
    JOIN clothing_items ci ON moi.item_id = ci.item_id
    WHERE o.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return errorResponse(res, "Failed to fetch outfits");

    return successResponse(res, "Outfits fetched", results);
  });
};