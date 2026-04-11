import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /api/contact
router.post("/", (req, res) => {
  const { name, email, message, user_id } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const query = `
    INSERT INTO contact_messages (user_id, name, email, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id || null, name, email, message],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Database error",
        });
      }

      res.json({ success: true });
    }
  );
});

export default router;