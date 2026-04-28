import db from "../config/db.js";

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
    /* 🔴 VALIDATION */
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
      [stylist_id, title, description, occasion, inspiration_image]
    );

    const templateId = result.insertId;

    /* 2️⃣ INSERT ITEMS (SAFE) */
    if (items && items.length > 0) {
      const values = items.map((item) => [
        templateId,
        item.item_id,
      ]);

      await db.promise().query(
        `INSERT INTO stylist_template_items (template_id, item_id) VALUES ?`,
        [values]
      );
    }

    /* ✅ SUCCESS */
    res.json({
      success: true,
      message: "Template + items saved",
    });

  } catch (err) {
    console.error("CREATE TEMPLATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};