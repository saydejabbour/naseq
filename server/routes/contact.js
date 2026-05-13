import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /api/contact
router.post("/", (req, res) => {
  const { name, email, message, user_id } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const query = `
    INSERT INTO contact_messages (user_id, name, email, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [user_id || null, name, email, message], (err) => {
    if (err) {
      console.error("CONTACT INSERT ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  });
});

// GET /api/contact/messages
router.get("/messages", (req, res) => {
  const query = `
    SELECT 
      message_id,
      user_id,
      name,
      email,
      message,
      status,
      admin_note,
      created_at
    FROM contact_messages
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("CONTACT FETCH ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
});

// PUT /api/contact/messages/:id/status
router.put("/messages/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, admin_note } = req.body;

  const allowedStatuses = ["new", "replied", "resolved"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  const query = `
    UPDATE contact_messages
    SET status = ?, admin_note = ?
    WHERE message_id = ?
  `;

  db.query(query, [status, admin_note || null, id], (err) => {
    if (err) {
      console.error("CONTACT STATUS UPDATE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      message: "Message status updated",
    });
  });
});

// POST /api/contact/messages/:id/reply
router.post("/messages/:id/reply", async (req, res) => {
  const { id } = req.params;
  const { email, name, replyMessage } = req.body;

  if (!email || !replyMessage) {
    return res.status(400).json({
      success: false,
      message: "Email and reply message are required",
    });
  }

  try {
    const { sendEmail } = await import("../utils/sendEmail.js");

    await sendEmail(
      email,
      "Reply from Naseq",
      `
        <p>Hello ${name || ""},</p>
        <p>${replyMessage}</p>
        <br />
        <p>Best regards,<br/>Naseq Team</p>
      `
    );

    await db.promise().query(
      `
      UPDATE contact_messages
      SET status = ?
      WHERE message_id = ?
      `,
      ["replied", id]
    );

    res.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (err) {
    console.error("SEND REPLY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
    });
  }
});

export default router;