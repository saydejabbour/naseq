import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 🔥 THIS IS THE IMPORTANT ROUTE
router.get("/", (req, res) => {
  const query = `
    SELECT 
      st.template_id,
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
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

export default router;