import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

/* ================= FOLDER ================= */
const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `orig-${Date.now()}.png`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  },
});

/* ================= ADD ITEM (FIXED) ================= */
export const addItem = async (req, res) => {
  let originalPath = null;
  let cleanPath = null;

  try {
    const {
      category_id,
      subcategory,
      color,
      style,
      season,
      occasion,
      user_id,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // ✅ ONLY REQUIRED FIELDS
    if (!category_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    originalPath = req.file.path;

    /* ================= REMOVE BG (SAFE) ================= */
    let imageUrl = "";

    try {
      const formData = new FormData();
      formData.append("image_file", fs.createReadStream(originalPath));
      formData.append("size", "auto");

      const bgResponse = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "X-Api-Key": process.env.REMOVE_BG_API_KEY,
          },
          responseType: "arraybuffer",
        }
      );

      cleanPath = path.join(UPLOAD_DIR, `clean-${Date.now()}.png`);
      fs.writeFileSync(cleanPath, bgResponse.data);

      fs.unlinkSync(originalPath);

      imageUrl = "/" + cleanPath.replace(/\\/g, "/");

    } catch (bgError) {
      console.warn("⚠️ remove.bg failed, using original image");

      imageUrl = "/" + originalPath.replace(/\\/g, "/");
    }

    /* ================= SAVE DB ================= */
    const query = `
      INSERT INTO clothing_items
      (user_id, category_id, subcategory, image_url, color, style, season, occasion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        user_id,
        category_id,
        subcategory || null,
        imageUrl,
        color || null,
        style || null,
        season || null,
        occasion || null,
      ],
      (err, result) => {
        if (err) {
          console.error("DB ERROR:", err);
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        return res.json({
          success: true,
          message: "Item added successfully",
          item_id: result.insertId,
          image_url: imageUrl,
        });
      }
    );

  } catch (err) {
    console.error("ADD ITEM ERROR:", err);

    if (originalPath && fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    if (cleanPath && fs.existsSync(cleanPath)) fs.unlinkSync(cleanPath);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET USER ITEMS ================= */
export const getUserItems = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT ci.*, c.name AS category_name
    FROM clothing_items ci
    JOIN categories c ON ci.category_id = c.category_id
    WHERE ci.user_id = ?
    ORDER BY ci.item_id DESC
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error." });
    }

    return res.json({
      success: true,
      data: results, // ✅ IMPORTANT FIX
    });
  });
};

/* ================= DELETE ================= */
export const deleteItem = (req, res) => {
  const { item_id } = req.params;

  db.query(
    "SELECT image_url FROM clothing_items WHERE item_id = ?",
    [item_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (!rows.length) {
        return res.status(404).json({ message: "Item not found" });
      }

      const filePath = rows[0].image_url.replace(/^\//, "");

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      }

      db.query(
        "DELETE FROM clothing_items WHERE item_id = ?",
        [item_id],
        (err) => {
          if (err) return res.status(500).json({ message: "Delete failed" });

          return res.json({
            success: true,
            message: "Item deleted",
          });
        }
      );
    }
  );
};