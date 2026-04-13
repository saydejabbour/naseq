import db from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";
import fs from "fs";
import path from "path";


// ================= CREATE OUTFIT WITH ITEMS =================
export const createOutfit = (req, res) => {
  const { user_id, name, items } = req.body;

  if (!user_id || !items || items.length === 0) {
    return errorResponse(res, "Missing required fields", 400);
  }

  const insertOutfitQuery =
    "INSERT INTO outfits (user_id, name) VALUES (?, ?)";

  db.query(
    insertOutfitQuery,
    [user_id, name || "My Outfit"],
    (err, result) => {
      if (err) {
        console.error("❌ Create outfit error:", err);
        return errorResponse(res, "Failed to create outfit");
      }

      const outfit_id = result.insertId;

      console.log("BACKEND RECEIVED:", items);

      // ✅ SAFE INSERT (loop)
      const insertItemsQuery = `
        INSERT INTO member_outfit_items 
        (outfit_id, item_id, x, y, width, height, rotation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      items.forEach((item) => {
        db.query(
          insertItemsQuery,
          [
            outfit_id,
            item.item_id,
            item.x,
            item.y,
            item.width,
            item.height,
            item.rotation,
          ],
          (err2) => {
            if (err2) {
              console.error("❌ Insert item error:", err2);
            }
          }
        );
      });

      return successResponse(res, "Outfit saved successfully", {
        outfit_id,
      });
    }
  );
};


// ================= SAVE OUTFIT AS IMAGE (🔥 NEW SYSTEM) =================
export const saveOutfitImage = (req, res) => {
  const { user_id, image } = req.body;

  if (!user_id || !image) {
    return errorResponse(res, "Missing data", 400);
  }

  try {
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    const fileName = `outfit_${Date.now()}.png`;

    const uploadPath = path.join("uploads");

    // create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, base64Data, "base64");

    const query =
      "INSERT INTO outfits (user_id, name, image_url) VALUES (?, ?, ?)";

    db.query(
      query,
      [user_id, "My Outfit", `/uploads/${fileName}`],
      (err) => {
        if (err) {
          console.error("❌ DB error:", err);
          return errorResponse(res, "Database error");
        }

        return successResponse(res, "Outfit saved as image", {
          image_url: `/uploads/${fileName}`,
        });
      }
    );
  } catch (err) {
    console.error("❌ Server error:", err);
    return errorResponse(res, "Server error");
  }
};


// ================= GET USER OUTFITS =================
export const getOutfits = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT outfit_id, name, image_url
    FROM outfits
    WHERE user_id = ?
    ORDER BY outfit_id DESC
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("❌ Fetch error:", err);
      return errorResponse(res, "Failed to fetch outfits");
    }

    return successResponse(res, "Outfits fetched", results);
  });
};


// ================= DELETE OUTFIT =================
export const deleteOutfit = (req, res) => {
  const { outfit_id } = req.params;

  const query = "DELETE FROM outfits WHERE outfit_id = ?";

  db.query(query, [outfit_id], (err) => {
    if (err) {
      console.error("❌ Delete error:", err);
      return errorResponse(res, "Failed to delete outfit");
    }

    return successResponse(res, "Outfit deleted");
  });
};