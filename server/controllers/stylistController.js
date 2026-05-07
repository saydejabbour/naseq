import db from "../config/db.js";
import fs from "fs";
import path from "path";

/* =========================
   CREATE STYLIST TEMPLATE
========================= */
export const createTemplate = async (req, res) => {
  const {
    stylist_id,
    title,
    description,
    occasion,
    inspiration_image,
    items,
  } = req.body;

  try {
    if (!stylist_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let imageUrl = null;

    if (inspiration_image && inspiration_image.startsWith("data:image")) {
      const uploadDir = path.join(process.cwd(), "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const matches = inspiration_image.match(/^data:image\/(\w+);base64,(.+)$/);

      if (!matches) {
        return res.status(400).json({
          success: false,
          message: "Invalid inspiration image format",
        });
      }

      const ext = matches[1];
      const base64Data = matches[2];
      const fileName = `template-${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

      imageUrl = `/uploads/${fileName}`;
    }

    const [result] = await db.promise().query(
      `INSERT INTO stylist_templates 
       (stylist_id, title, description, occasion, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [stylist_id, title, description, occasion, imageUrl]
    );

    const templateId = result.insertId;

    if (items && items.length > 0) {
      const values = items.map((item) => [templateId, item.item_id]);

      await db.promise().query(
        `INSERT INTO stylist_template_items (template_id, item_id) VALUES ?`,
        [values]
      );
    }

    res.json({
      success: true,
      message: "Template saved successfully",
      image_url: imageUrl,
    });
  } catch (err) {
    console.error("CREATE TEMPLATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

/* =========================
   GET ALL STYLIST ACCOUNTS
========================= */
export const getStylistAccounts = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `
      SELECT
        sa.application_id,
        sa.user_id,
        sa.status,
        sa.bio,
        sa.profile_photo,
        u.full_name AS name,
        u.email
      FROM stylist_applications sa
      JOIN users u ON sa.user_id = u.user_id
      ORDER BY sa.application_id DESC
      `
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("GET STYLIST ACCOUNTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

/* =========================
   GET ONE STYLIST APPLICATION
========================= */
export const getStylistApplicationById = async (req, res) => {
  const { application_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `
      SELECT
        sa.application_id,
        sa.user_id,
        sa.status,
        sa.bio,
        sa.profile_photo,
        u.full_name AS name,
        u.email
      FROM stylist_applications sa
      JOIN users u ON sa.user_id = u.user_id
      WHERE sa.application_id = ?
      `,
      [application_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("GET STYLIST APPLICATION ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

/* =========================
   UPDATE STYLIST STATUS
========================= */
export const updateStylistStatus = async (req, res) => {
  const { application_id } = req.params;
  const { status } = req.body;

  try {
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    await db.promise().query(
      `
      UPDATE stylist_applications
      SET status = ?
      WHERE application_id = ?
      `,
      [status, application_id]
    );

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.error("UPDATE STYLIST STATUS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};