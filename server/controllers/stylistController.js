import db from "../config/db.js";
import fs from "fs";
import path from "path";


export const createTemplate = async (req, res) => {
  const {
    stylist_id,
    title,
    description,
    style,
    season,
    inspiration_image,
    items,
  } = req.body;

  console.log("BODY KEYS:", Object.keys(req.body));
console.log("HAS INSPIRATION:", !!inspiration_image);
console.log("INSPIRATION START:", inspiration_image?.slice(0, 30));
console.log("BACKEND BODY KEYS:", Object.keys(req.body));
console.log("BACKEND INSPIRATION:", inspiration_image?.slice(0, 40));

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