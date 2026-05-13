import express from "express";
import multer from "multer";
import db from "../config/db.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();


/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ================= ADMIN: GET REAL STYLIST ACCOUNTS ================= */
router.get("/admin/stylist-accounts", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        sp.stylist_id AS application_id,
        u.user_id,
        u.full_name AS name,
        u.email,
        sp.bio,
        COALESCE(sp.status, 'Approved') AS status
       FROM stylist_profiles sp
       JOIN users u ON sp.user_id = u.user_id
       ORDER BY sp.stylist_id DESC`
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET STYLIST ACCOUNTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stylist accounts",
      error: err.message,
    });
  }
});

/* ================= ADMIN: UPDATE STYLIST STATUS ================= */
router.patch("/admin/stylist-accounts/:application_id/status", async (req, res) => {
  try {
    const { application_id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

   const [profiles] = await db.promise().query(
  `SELECT 
     sp.user_id,
     u.full_name,
     u.email
   FROM stylist_profiles sp
   JOIN users u ON sp.user_id = u.user_id
   WHERE sp.stylist_id = ?`,
  [application_id]
);

    if (profiles.length === 0) {
      return res.status(404).json({ success: false, message: "Stylist not found" });
    }

    const userId = profiles[0].user_id;
    const stylistName = profiles[0].full_name;
    const stylistEmail = profiles[0].email;

    await db.promise().query(
      `UPDATE stylist_profiles SET status = ? WHERE stylist_id = ?`,
      [status, application_id]
    );

if (status === "Approved") {
  await db.promise().query(
    `UPDATE users 
     SET role = 'stylist',
         stylist_status = 'approved'
     WHERE user_id = ?`,
    [userId]
  );
}

if (status === "Rejected") {
  await db.promise().query(
    `UPDATE users 
     SET role = 'member',
         stylist_status = NULL,
         is_verified = true,
         verification_token = NULL,
         verification_expires = NULL
     WHERE user_id = ?`,
    [userId]
  );
}

const loginLink = "http://localhost:3000/login";

if (status === "Approved") {
  await sendEmail(
    stylistEmail,
    "Your Naseq Stylist Application Has Been Approved",
    `
    <h2>Congratulations, ${stylistName}!</h2>
    <p>Your stylist application has been approved.</p>
    <p>You can now log in and access your stylist dashboard.</p>
    <a href="${loginLink}" 
       style="display:inline-block;padding:12px 18px;background:#7CB98B;color:white;text-decoration:none;border-radius:8px;">
       Go to Login
    </a>
    <p>Welcome to the Naseq stylist community.</p>
    `
  );
}

if (status === "Rejected") {
  await sendEmail(
    stylistEmail,
    "Update on Your Naseq Stylist Application",
    `
    <h2>Hello ${stylistName},</h2>
    <p>Thank you for applying to become a stylist on Naseq.</p>
    <p>After reviewing your application, we are unable to approve it at this time.</p>
    <p>You can now log in and continue using Naseq as a member.</p>

<a href="${loginLink}" 
   style="display:inline-block;padding:12px 18px;background:#7CB98B;color:white;text-decoration:none;border-radius:8px;">
   Go to Login
</a>

<p>You are welcome to improve your profile and apply again in the future.</p>
    <p>Thank you for your interest in joining our stylist community.</p>
    `
  );
}

    return res.json({
      success: true,
      message: `Stylist ${status} successfully`,
    });
  } catch (err) {
    console.error("UPDATE STYLIST STATUS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update stylist status",
      error: err.message,
    });
  }
});

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
        `INSERT INTO stylist_profiles (user_id, name, bio, profile_photo, status)
         VALUES (?, ?, ?, ?, ?)`,
        [
          user_id,
          defaultName,
          "Fashion stylist specializing in everyday chic looks.",
          "",
          "Approved",
        ]
      );

      profiles = [
        {
          stylist_id: insertResult.insertId,
          user_id,
          name: defaultName,
          bio: "Fashion stylist specializing in everyday chic looks.",
          profile_photo: "",
          status: "Approved",
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
      data: { ...profile, portfolio },
    });
  } catch (err) {
    console.error("GET STYLIST PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get stylist profile",
      error: err.message,
    });
  }
});

/* ================= ADMIN: GET ONE STYLIST ACCOUNT ================= */
router.get("/admin/stylist-accounts/:application_id", async (req, res) => {
  try {
    const { application_id } = req.params;

    const [rows] = await db.promise().query(
      `SELECT 
        sp.stylist_id AS application_id,
        u.user_id,
        u.full_name AS name,
        u.email,
        sp.bio,
        sp.profile_photo,
        COALESCE(sp.status, 'Approved') AS status
       FROM stylist_profiles sp
       JOIN users u ON sp.user_id = u.user_id
       WHERE sp.stylist_id = ?`,
      [application_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stylist not found",
      });
    }

    const stylist = rows[0];

    const [portfolio] = await db.promise().query(
      `SELECT portfolio_id, image_url
       FROM stylist_portfolio
       WHERE stylist_id = ?
       ORDER BY portfolio_id DESC`,
      [application_id]
    );

    return res.json({
      success: true,
      data: {
        ...stylist,
        portfolio,
      },
    });
  } catch (err) {
    console.error("GET ONE STYLIST ACCOUNT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stylist account",
      error: err.message,
    });
  }
});

/* ================= SAVE STYLIST PROFILE ================= */
router.post("/profile/save", upload.single("profileImage"), async (req, res) => {
  try {
    const { user_id, name, bio } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "Missing user_id" });
    }

    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : null;

    const [existing] = await db.promise().query(
      `SELECT stylist_id FROM stylist_profiles WHERE user_id = ?`,
      [user_id]
    );

    if (existing.length === 0) {
      await db.promise().query(
        `INSERT INTO stylist_profiles (user_id, name, bio, profile_photo, status)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, name, bio, profilePhoto || "", "Approved"]
      );
    } else if (profilePhoto) {
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

    return res.json({ success: true, message: "Profile saved successfully" });
  } catch (err) {
    console.error("SAVE STYLIST PROFILE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
      error: err.message,
    });
  }
});

/* ================= ADD PORTFOLIO IMAGE ================= */
router.post("/profile/portfolio", upload.single("portfolioImage"), async (req, res) => {
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

    const imageUrl = `/uploads/${req.file.filename}`;

    await db.promise().query(
      `INSERT INTO stylist_portfolio (stylist_id, image_url)
       VALUES (?, ?)`,
      [profileRows[0].stylist_id, imageUrl]
    );

    return res.json({ success: true, message: "Portfolio image added" });
  } catch (err) {
    console.error("ADD PORTFOLIO ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to add portfolio image",
      error: err.message,
    });
  }
});

/* ================= DELETE PORTFOLIO IMAGE ================= */
router.delete("/profile/portfolio/:portfolio_id", async (req, res) => {
  try {
    const { portfolio_id } = req.params;

    await db.promise().query(
      `DELETE FROM stylist_portfolio WHERE portfolio_id = ?`,
      [portfolio_id]
    );

    return res.json({ success: true, message: "Portfolio image deleted" });
  } catch (err) {
    console.error("DELETE PORTFOLIO ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete portfolio image",
      error: err.message,
    });
  }
});

/* ================= CREATE TEMPLATE ================= */
router.post("/templates", async (req, res) => {
  try {
    const { stylist_id, title, description, style, season, inspiration_image, items } = req.body;

    if (!stylist_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const [profileRows] = await db.promise().query(
      `SELECT stylist_id FROM stylist_profiles WHERE user_id = ?`,
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
        `SELECT image_url FROM clothing_items WHERE item_id = ? LIMIT 1`,
        [itemIds[0]]
      );

      if (imageRows.length > 0) {
        templateImage = imageRows[0].image_url;
      }
    } else if (inspiration_image && inspiration_image.startsWith("data:image")) {
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
      `SELECT stylist_id FROM stylist_profiles WHERE user_id = ?`,
      [user_id]
    );

    if (profileRows.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const [templates] = await db.promise().query(
      `SELECT *
       FROM stylist_templates
       WHERE stylist_id = ?
       ORDER BY template_id DESC`,
      [profileRows[0].stylist_id]
    );

    return res.json({ success: true, data: templates });
  } catch (err) {
    console.error("GET MY TEMPLATES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: err.message,
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

    const [portfolio] = await db.promise().query(
      `SELECT portfolio_id, image_url
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
      error: err.message,
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
      `UPDATE stylist_templates SET title = ? WHERE template_id = ?`,
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
      error: err.message,
    });
  }
});

/* ================= DELETE TEMPLATE ================= */
router.delete("/templates/:template_id", async (req, res) => {
  try {
    const { template_id } = req.params;

    await db.promise().query(
      `DELETE FROM stylist_template_items WHERE template_id = ?`,
      [template_id]
    );

    await db.promise().query(
      `DELETE FROM stylist_templates WHERE template_id = ?`,
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
      error: err.message,
    });
  }
});
/* ================= CONTINUE AS MEMBER ================= */
router.patch("/continue-as-member/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    await db.promise().query(
      `UPDATE users 
       SET role = 'member', stylist_status = NULL
       WHERE user_id = ?`,
      [user_id]
    );

    await db.promise().query(
      `UPDATE stylist_profiles 
       SET status = 'Rejected'
       WHERE user_id = ?`,
      [user_id]
    );

    return res.json({
      success: true,
      message: "Account changed to member successfully",
    });
  } catch (err) {
    console.error("CONTINUE AS MEMBER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to continue as member",
    });
  }
});

export default router;