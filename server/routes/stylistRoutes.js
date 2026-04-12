import express from "express";
import multer from "multer";
import db from "../config/db.js";

const router = express.Router();

// 🔥 STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🔥 APPLY ROUTE
router.post(
  "/apply",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "portfolio", maxCount: 10 },
  ]),
  (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILES:", req.files);

      const { full_name, email, bio } = req.body;

      const profileImage = req.files["profileImage"]?.[0]?.filename;

      // 🚨 TEMP FIX: ADD user_id
      const userId = 1; // later we replace with logged-in user

      const query = `
        INSERT INTO stylist_applications 
        (full_name, email, bio, profile_photo, user_id) 
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        query,
        [full_name, email, bio, profileImage, userId],
        (err, result) => {
          if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({
              success: false,
              message: "Database error",
            });
          }

          console.log("INSERTED ID:", result.insertId);

          // 🔥 SAVE PORTFOLIO IMAGES
          const portfolioFiles = req.files["portfolio"] || [];

          if (portfolioFiles.length > 0) {
            const portfolioQuery = `
              INSERT INTO portfolio_images (stylist_id, image_url)
              VALUES ?
            `;

            const values = portfolioFiles.map((file) => [
              result.insertId,
              file.filename,
            ]);

            db.query(portfolioQuery, [values], (err2) => {
              if (err2) {
                console.error("PORTFOLIO ERROR:", err2);
              }
            });
          }

          return res.json({
            success: true,
            message: "Application + portfolio saved",
          });
        }
      );

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

export default router;