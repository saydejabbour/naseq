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

/* ================= GET STYLIST PROFILE ================= */
router.get("/profile/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    let [profiles] = await db.promise().query(
      `SELECT * FROM stylist_profiles WHERE user_id = ?`,
      [user_id]
    );

    if (profiles.length === 0) {
      const [userRows] = await db.promise().query(
        `SELECT full_name FROM users WHERE user_id = ?`,
        [user_id]
      );

      const defaultName = userRows[0]?.full_name || "Stylist";

      const [insertResult] = await db.promise().query(
        `INSERT INTO stylist_profiles (user_id, name, bio, profile_photo)
         VALUES (?, ?, ?, ?)`,
        [
          user_id,
          defaultName,
          "Fashion stylist specializing in everyday chic looks.",
          "",
        ]
      );

      profiles = [
        {
          stylist_id: insertResult.insertId,
          user_id,
          name: defaultName,
          bio: "Fashion stylist specializing in everyday chic looks.",
          profile_photo: "",
        },
      ];
    }

    const profile = profiles[0];

    const [portfolio] = await db.promise().query(
      `SELECT portfolio_id, image_url
       FROM stylist_portfolio
       WHERE stylist_id = ?
       ORDER BY portfolio_id DESC`,
      [profile.stylist_id]
    );

    return res.json({
      success: true,
      data: {
        ...profile,
        portfolio,
      },
    });
  } catch (err) {
    console.error("GET STYLIST PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get stylist profile",
    });
  }
});

/* ================= SAVE STYLIST PROFILE ================= */
router.post(
  "/profile/save",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { user_id, name, bio } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "Missing user_id",
        });
      }

      const profilePhoto = req.file ? `/uploads/${req.file.filename}` : null;

      const [existing] = await db.promise().query(
        `SELECT stylist_id FROM stylist_profiles WHERE user_id = ?`,
        [user_id]
      );

      if (existing.length === 0) {
        await db.promise().query(
          `INSERT INTO stylist_profiles (user_id, name, bio, profile_photo)
           VALUES (?, ?, ?, ?)`,
          [user_id, name, bio, profilePhoto || ""]
        );
      } else {
        if (profilePhoto) {
          await db.promise().query(
            `UPDATE stylist_profiles
             SET name = ?, bio = ?, profile_photo = ?
             WHERE user_id = ?`,
            [name, bio, profilePhoto, user_id]
          );
        } else {
          await db.promise().query(
            `UPDATE stylist_profiles
             SET name = ?, bio = ?
             WHERE user_id = ?`,
            [name, bio, user_id]
          );
        }
      }

      return res.json({
        success: true,
        message: "Profile saved successfully",
      });
    } catch (err) {
      console.error("SAVE STYLIST PROFILE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to save profile",
      });
    }
  }
);

/* ================= ADD PORTFOLIO IMAGE ================= */
router.post(
  "/profile/portfolio",
  upload.single("portfolioImage"),
  async (req, res) => {
    try {
      const { user_id } = req.body;

      if (!user_id || !req.file) {
        return res.status(400).json({
          success: false,
          message: "Missing user_id or image",
        });
      }

      const [profileRows] = await db.promise().query(
        `SELECT stylist_id FROM stylist_profiles WHERE user_id = ?`,
        [user_id]
      );

      if (profileRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Stylist profile not found",
        });
      }

      const stylistId = profileRows[0].stylist_id;
      const imageUrl = `/uploads/${req.file.filename}`;

      await db.promise().query(
        `INSERT INTO stylist_portfolio (stylist_id, image_url)
         VALUES (?, ?)`,
        [stylistId, imageUrl]
      );

      return res.json({
        success: true,
        message: "Portfolio image added",
      });
    } catch (err) {
      console.error("ADD PORTFOLIO ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to add portfolio image",
      });
    }
  }
);

/* ================= DELETE PORTFOLIO IMAGE ================= */
router.delete("/profile/portfolio/:portfolio_id", async (req, res) => {
  try {
    const { portfolio_id } = req.params;

    await db.promise().query(
      `DELETE FROM stylist_portfolio WHERE portfolio_id = ?`,
      [portfolio_id]
    );

    return res.json({
      success: true,
      message: "Portfolio image deleted",
    });
  } catch (err) {
    console.error("DELETE PORTFOLIO ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete portfolio image",
    });
  }
});

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
    const { stylist_id, title, description, style, season, items } = req.body;

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

const { inspiration_image } = req.body;

let templateImage = null;

/* ✅ 1. If canvas items exist → use wardrobe image */
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

/* ✅ 2. If NO canvas items → use inspiration image */
else if (inspiration_image && inspiration_image.startsWith("data:image")) {
  const fs = await import("fs");
  const path = await import("path");

  const uploadDir = path.default.join(process.cwd(), "uploads");

  if (!fs.default.existsSync(uploadDir)) {
    fs.default.mkdirSync(uploadDir);
  }

  const matches = inspiration_image.match(/^data:image\/(\w+);base64,(.+)$/);

  if (matches) {
    const ext = matches[1];
    const base64Data = matches[2];
    const fileName = `template-${Date.now()}.${ext}`;
    const filePath = path.default.join(uploadDir, fileName);

    fs.default.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    templateImage = `/uploads/${fileName}`;
  }
}

   
      const [result] = await db.promise().query(
  `INSERT INTO stylist_templates 
   (stylist_id, title, description, style, season, image_url)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    realStylistId,
    title,
    description || "",
    style || "",
    season || "",
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
      `SELECT stylist_id 
       FROM stylist_profiles 
       WHERE user_id = ?`,
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

/* ================= PUBLIC STYLIST PROFILE ================= */
router.get("/public/:stylist_id", async (req, res) => {
  try {
    const { stylist_id } = req.params;

    const [profileRows] = await db.promise().query(
      `SELECT stylist_id, user_id, name, bio, profile_photo
       FROM stylist_profiles
       WHERE stylist_id = ?`,
      [stylist_id]
    );

    if (profileRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stylist not found",
      });
    }

    const [templates] = await db.promise().query(
      `SELECT *
       FROM stylist_templates
       WHERE stylist_id = ?
       ORDER BY template_id DESC`,
      [stylist_id]
    );

    const [portfolio] = await db.promise().query(
  `SELECT portfolio_id, image_url
   FROM stylist_portfolio
   WHERE stylist_id = ?
   ORDER BY portfolio_id DESC`,
  [stylist_id]
);

    return res.json({
      success: true,
      data: {
        profile: profileRows[0],
        portfolio,
        templates,
      },
    });
  } catch (err) {
    console.error("PUBLIC STYLIST PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load stylist profile",
    });
  }
});

/* ================= PUBLIC STYLIST PROFILE ================= */
router.get("/public/:stylist_id", async (req, res) => {
  try {
    const { stylist_id } = req.params;

    const [profileRows] = await db.promise().query(
      `SELECT 
        stylist_id,
        user_id,
        name,
        bio,
        profile_photo
       FROM stylist_profiles
       WHERE stylist_id = ?`,
      [stylist_id]
    );

    if (profileRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stylist not found",
      });
    }

    const [portfolio] = await db.promise().query(
      `SELECT 
        portfolio_id,
        image_url
       FROM stylist_portfolio
       WHERE stylist_id = ?
       ORDER BY portfolio_id DESC`,
      [stylist_id]
    );

    const [templates] = await db.promise().query(
      `SELECT *
       FROM stylist_templates
       WHERE stylist_id = ?
       ORDER BY template_id DESC`,
      [stylist_id]
    );

    return res.json({
      success: true,
      data: {
        profile: profileRows[0],
        portfolio,
        templates,
      },
    });
  } catch (err) {
    console.error("PUBLIC STYLIST PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load stylist profile",
    });
  }
});

/* ================= RENAME TEMPLATE ================= */
router.put("/templates/:template_id", async (req, res) => {
  try {
    const { template_id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    await db.promise().query(
      `UPDATE stylist_templates 
       SET title = ? 
       WHERE template_id = ?`,
      [title.trim(), template_id]
    );

    return res.json({
      success: true,
      message: "Template renamed successfully",
    });
  } catch (err) {
    console.error("RENAME TEMPLATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to rename template",
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