import db from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const saveTemplate = (req, res) => {
  const { user_id, template_id } = req.body;

  if (!user_id || !template_id) {
    return errorResponse(res, "Missing data");
  }

  const checkQuery = `
    SELECT * FROM saved_templates 
    WHERE user_id = ? AND template_id = ?
  `;

  db.query(checkQuery, [user_id, template_id], (err, results) => {
    if (err) return errorResponse(res, "Database error");

    if (results.length > 0) {
      return errorResponse(res, "Already saved");
    }

    const insertQuery = `
      INSERT INTO saved_templates (user_id, template_id)
      VALUES (?, ?)
    `;

    db.query(insertQuery, [user_id, template_id], (err) => {
      if (err) return errorResponse(res, "Save failed");

      return successResponse(res, "Outfit saved successfully");
    });
  });
};

export const getSavedTemplates = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      st.template_id,
      st.title,
      st.description,
      st.style,
      st.season,
      st.occasion,
      st.image_url,
      u.full_name AS stylist_name
    FROM saved_templates s
    JOIN stylist_templates st ON s.template_id = st.template_id
    JOIN users u ON st.stylist_id = u.user_id
    WHERE s.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("🔥 SQL ERROR:", err); // IMPORTANT
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
};

export const removeSavedTemplate = (req, res) => {
  const { user_id, template_id } = req.params;

  // 🔥 DEBUG 1: Check request is reaching backend
  console.log("DELETE REQUEST RECEIVED:");
  console.log("user_id:", user_id);
  console.log("template_id:", template_id);

  const query = `
    DELETE FROM saved_templates
    WHERE user_id = ? AND template_id = ?
  `;

  db.query(query, [user_id, template_id], (err, result) => {
    if (err) {
      console.error("❌ DELETE ERROR:", err);
      return res.status(500).json({ success: false });
    }

    // 🔥 DEBUG 2: Check if row actually deleted
    console.log("ROWS AFFECTED:", result.affectedRows);

    res.json({ success: true });
  });
};