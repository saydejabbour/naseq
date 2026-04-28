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
            console.error("APPLICATION ERROR:", err);
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
      console.error("APPLY SERVER ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/* ================= CREATE TEMPLATE ================= */
router.post("/templates", async (req, res) => {
  try {
    const { stylist_id, title, description, occasion, items } = req.body;

    if (!stylist_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const [profileRows] = await db.promise().query(
      "SELECT stylist_id FROM stylist_profiles WHERE user_id = ?",
      [stylist_id]
    );

    if (profileRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Stylist profile not found.",
      });
    }

    const realStylistId = profileRows[0].stylist_id;
    const parsedItems = Array.isArray(items) ? items : [];

    const itemIds = parsedItems
      .map((item) => item.item_id || item.itemId)
      .filter(Boolean);

    let templateImage = null;

    if (itemIds.length > 0) {
      const [imageRows] = await db.promise().query(
        `SELECT image_url
         FROM clothing_items
         WHERE item_id = ?
         LIMIT 1`,
        [itemIds[0]]
      );

      if (imageRows.length > 0) {
        templateImage = imageRows[0].image_url;
      }
    }

    const [result] = await db.promise().query(
      `INSERT INTO stylist_templates 
       (stylist_id, title, description, occasion, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        realStylistId,
        title,
        description || "",
        occasion || "",
        templateImage,
      ]
    );

    const templateId = result.insertId;

    if (itemIds.length > 0) {
      const values = itemIds.map((itemId) => [templateId, itemId]);

      await db.promise().query(
        `INSERT INTO stylist_template_items (template_id, item_id) VALUES ?`,
        [values]
      );
    }

    return res.json({
      success: true,
      message: "Template saved",
      data: {
        template_id: templateId,
        image_url: templateImage,
      },
    });
  } catch (err) {
    console.error("CREATE TEMPLATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Template save failed",
      error: err.message,
    });
  }
});

/* ================= GET MY TEMPLATES ================= */
router.get("/templates/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [profileRows] = await db.promise().query(
      "SELECT stylist_id FROM stylist_profiles WHERE user_id = ?",
      [user_id]
    );

    if (profileRows.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const realStylistId = profileRows[0].stylist_id;

    const [templates] = await db.promise().query(
      `SELECT *
       FROM stylist_templates
       WHERE stylist_id = ?
       ORDER BY template_id DESC`,
      [realStylistId]
    );

    return res.json({
      success: true,
      data: templates,
    });
  } catch (err) {
    console.error("GET MY TEMPLATES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
});

/* ================= DELETE TEMPLATE ================= */
router.delete("/templates/:template_id", async (req, res) => {
  try {
    const { template_id } = req.params;

    await db.promise().query(
      "DELETE FROM stylist_template_items WHERE template_id = ?",
      [template_id]
    );

    await db.promise().query(
      "DELETE FROM stylist_templates WHERE template_id = ?",
      [template_id]
    );

    return res.json({
      success: true,
      message: "Template deleted",
    });
  } catch (err) {
    console.error("DELETE TEMPLATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete template",
    });
  }
});

export default router;