import db from "../config/db.js";

// ================= GET ALL ANNOUNCEMENTS =================
export const getAnnouncements = async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = `
      SELECT a.*
      FROM announcements a
    `;

    const values = [];

    if (user_id) {
      query += `
        LEFT JOIN announcement_dismissals d
          ON a.announcement_id = d.announcement_id
          AND d.user_id = ?
        WHERE d.dismissal_id IS NULL
      `;

      values.push(user_id);
    }

    query += `
      ORDER BY a.created_at DESC
    `;

    const [results] = await db.promise().query(query, values);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log("GET ANNOUNCEMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= DISMISS ANNOUNCEMENT FOR USER =================
export const dismissAnnouncement = async (req, res) => {
  try {
    const { announcement_id, user_id } = req.body;

    if (!announcement_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "announcement_id and user_id are required",
      });
    }

    await db.promise().query(
      `
      INSERT IGNORE INTO announcement_dismissals
      (announcement_id, user_id)
      VALUES (?, ?)
      `,
      [announcement_id, user_id]
    );

    res.json({
      success: true,
      message: "Announcement dismissed",
    });
  } catch (error) {
    console.log("DISMISS ANNOUNCEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= CREATE ANNOUNCEMENT =================
export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      message,
      target_role,
      type,
    } = req.body;

    await db.promise().query(
      `
      INSERT INTO announcements
      (title, message, target_role, type)
      VALUES (?, ?, ?, ?)
      `,
      [
        title,
        message,
        target_role || "all",
        type || "info",
      ]
    );

    res.json({
      success: true,
      message: "Announcement created successfully",
    });
  } catch (error) {
    console.log("CREATE ANNOUNCEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= UPDATE ANNOUNCEMENT =================
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      message,
      target_role,
      type,
      is_active,
    } = req.body;

    await db.promise().query(
      `
      UPDATE announcements
      SET
        title = ?,
        message = ?,
        target_role = ?,
        type = ?,
        is_active = ?
      WHERE announcement_id = ?
      `,
      [
        title,
        message,
        target_role,
        type,
        is_active,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Announcement updated successfully",
    });
  } catch (error) {
    console.log("UPDATE ANNOUNCEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= DELETE ANNOUNCEMENT =================
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    await db.promise().query(
      `
      DELETE FROM announcements
      WHERE announcement_id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ANNOUNCEMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};