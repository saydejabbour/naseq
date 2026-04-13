import express from "express";
import db from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { saveOutfitImage } from "../controllers/outfitController.js";

const router = express.Router();


// =========================
// ✅ 1. EXPLORE (STYLIST TEMPLATES)
// =========================
router.get("/", (req, res) => {
  const query = `
    SELECT 
      st.template_id AS id,
      st.title,
      st.style,
      st.season,
      st.occasion,
      st.image_url,
      u.full_name AS stylist
    FROM stylist_templates st
    JOIN stylist_profiles sp ON st.stylist_id = sp.stylist_id
    JOIN users u ON sp.user_id = u.user_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Query error:", err);
      return errorResponse(res, "Database error");
    }

    return successResponse(res, "Outfits fetched successfully", results);
  });
});


// =========================
// ✅ 2. SAVE OUTFIT AS IMAGE (🔥 MAIN FEATURE)
// =========================
router.post("/save-image", saveOutfitImage);


// =========================
// ✅ 3. GET USER SAVED OUTFITS (IMAGE VERSION)
// =========================
router.get("/user/:user_id", (req, res) => {
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

    return successResponse(res, "Saved outfits fetched", results);
  });
});


// =========================
// ✅ 4. TEMPLATE DETAILS
// =========================
router.get("/template/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      st.template_id AS id,
      st.title,
      st.description,
      st.style,
      st.season,
      st.occasion,
      st.image_url,
      u.full_name AS stylist
    FROM stylist_templates st
    JOIN stylist_profiles sp ON st.stylist_id = sp.stylist_id
    JOIN users u ON sp.user_id = u.user_id
    WHERE st.template_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ Query error:", err);
      return errorResponse(res, "Database error");
    }

    if (results.length === 0) {
      return errorResponse(res, "Outfit not found");
    }

    return successResponse(res, "Outfit fetched successfully", results[0]);
  });
});


// =========================
// ✅ 5. DELETE OUTFIT
// =========================
router.delete("/:outfit_id", (req, res) => {
  const { outfit_id } = req.params;

  const query = "DELETE FROM outfits WHERE outfit_id = ?";

  db.query(query, [outfit_id], (err) => {
    if (err) {
      console.error("❌ Delete error:", err);
      return errorResponse(res, "Failed to delete outfit");
    }

    return successResponse(res, "Outfit deleted");
  });
});


export default router;