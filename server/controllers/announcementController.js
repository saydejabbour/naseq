import db from "../config/db.js";

// ================= GET ALL ANNOUNCEMENTS =================
export const getAnnouncements = async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT *
      FROM announcements
      ORDER BY created_at DESC
    `);

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