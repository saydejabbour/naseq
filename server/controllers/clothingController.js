import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// ── ensure uploads folder exists ─────────────────────────
const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// ── multer: store original upload temporarily ────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `orig-${Date.now()}.png`),
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// ── ADD ITEM ─────────────────────────────────────────────
export const addItem = async (req, res) => {
  let originalPath = null;
  let cleanPath = null;

  try {
    // ── 1. validate required body fields ─────────────────
    const { category_id, color, style, season, occasion, user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }
    if (!category_id || !color || !style || !season || !occasion || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    originalPath = req.file.path;

    // ── 2. remove background via remove.bg ───────────────
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(originalPath));
    formData.append("size", "auto");

    const bgResponse = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_API_KEY, // set in your .env
        },
        responseType: "arraybuffer",
        timeout: 30_000,
      }
    );

    cleanPath = path.join(UPLOAD_DIR, `clean-${Date.now()}.png`);
    fs.writeFileSync(cleanPath, bgResponse.data);

    // delete the original (we only keep the clean version)
    fs.unlinkSync(originalPath);
    originalPath = null;

    // ── 3. save to database ───────────────────────────────
    const imageUrl = "/" + cleanPath.replace(/\\/g, "/"); // normalize Windows paths

    const query = `
      INSERT INTO clothing_items
        (user_id, category_id, image_url, color, style, season, occasion)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [user_id, category_id, imageUrl, color, style, season, occasion],
      (err, result) => {
        if (err) {
          console.error("DB insert error:", err);
          // clean up clean image if DB fails
          if (cleanPath && fs.existsSync(cleanPath)) fs.unlinkSync(cleanPath);
          return res.status(500).json({ message: "Database error." });
        }

        return res.status(201).json({
          success: true,
          message: "Item added successfully.",
          item_id: result.insertId,
          image_url: imageUrl,
        });
      }
    );
  } catch (err) {
    // clean up any leftover files on error
    if (originalPath && fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    if (cleanPath && fs.existsSync(cleanPath)) fs.unlinkSync(cleanPath);

    if (err.response) {
      // remove.bg returned an error
      const msg = err.response.data?.toString() || "remove.bg API error";
      console.error("remove.bg error:", msg);
      return res.status(502).json({ message: "Background removal failed. Try again." });
    }

    console.error("addItem error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// ── GET ALL ITEMS FOR A USER ──────────────────────────────
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
      console.error("getUserItems error:", err);
      return res.status(500).json({ message: "Database error." });
    }
    return res.json({ success: true, items: results });
  });
};

// ── DELETE ITEM ───────────────────────────────────────────
export const deleteItem = (req, res) => {
  const { item_id } = req.params;

  // first fetch image path so we can delete the file
  db.query(
    "SELECT image_url FROM clothing_items WHERE item_id = ?",
    [item_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error." });
      if (!rows.length) return res.status(404).json({ message: "Item not found." });

      const filePath = rows[0].image_url.replace(/^\//, ""); // strip leading /
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }

      db.query(
        "DELETE FROM clothing_items WHERE item_id = ?",
        [item_id],
        (delErr) => {
          if (delErr) return res.status(500).json({ message: "Delete failed." });
          return res.json({ success: true, message: "Item deleted." });
        }
      );
    }
  );
};