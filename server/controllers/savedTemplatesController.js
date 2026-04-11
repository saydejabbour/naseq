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