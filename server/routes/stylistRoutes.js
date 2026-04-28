import express from "express";
import multer from "multer";
import db from "../config/db.js";

const router = express.Router();

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= APPLY ================= */
router.post(
  "/apply",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "portfolio", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      const { full_name, email, bio, user_id } = req.body;
      const profileImage = req.files["profileImage"]?.[0]?.filename;

      const query = `
        INSERT INTO stylist_applications 
        (full_name, email, bio, profile_photo, user_id) 
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        query,
        [full_name, email, bio, profileImage, user_id],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              message: "Database error",
            });
          }

          const portfolioFiles = req.files["portfolio"] || [];

          if (portfolioFiles.length > 0) {
            const values = portfolioFiles.map((file) => [
              result.insertId,
              file.filename,
            ]);

            db.query(
              "INSERT INTO portfolio_images (stylist_id, image_url) VALUES ?",
              [values]
            );
          }

          return res.json({
            success: true,
            message: "Application + portfolio saved",
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/* ================= CREATE TEMPLATE ================= */
router.post(
  "/templates",
  upload.single("inspiration_image"),
  async (req, res) => {
    try {
      const {
        stylist_id,
        title,
        description,
        occasion,
        items,
      } = req.body;

      const imageFile = req.file?.filename;

      if (!stylist_id || !title) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      /* 1️⃣ INSERT TEMPLATE */
      const [result] = await db.promise().query(
        `INSERT INTO stylist_templates 
         (stylist_id, title, description, occasion, image_url)
         VALUES (?, ?, ?, ?, ?)`,
        [
          stylist_id,
          title,
          description || null,
          occasion || null,
          imageFile ? `/uploads/${imageFile}` : null,
        ]
      );

      const templateId = result.insertId;

      /* 2️⃣ INSERT ITEMS */
      let parsedItems = [];

      try {
        parsedItems = JSON.parse(items);
      } catch {
        parsedItems = [];
      }

      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        const values = parsedItems
          .map((item) => {
            const itemId = item.item_id || item.itemId;
            return itemId ? [templateId, itemId] : null;
          })
          .filter(Boolean);

        if (values.length > 0) {
          await db.promise().query(
            `INSERT INTO stylist_template_items (template_id, item_id) VALUES ?`,
            [values]
          );
        }
      }

      return res.json({
        success: true,
        message: "Template saved",
      });

    } catch (err) {
      console.error("TEMPLATE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Template save failed",
      });
    }
  }
);

/* 🔥 THIS LINE WAS YOUR PROBLEM */
export default router;