import express from "express";
import db from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";

const router = express.Router();


// ✅ 1. GET ALL OUTFITS (Explore Page)
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


// ✅ 2. ADD THIS (Details Page)
router.get("/:id", (req, res) => {
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


export default router;