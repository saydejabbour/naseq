import db from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { successResponse, errorResponse } from "../utils/response.js";
import { sendEmail } from "../utils/sendEmail.js";


// ================= REGISTER =================
export const register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password) {
    return errorResponse(res, "All fields are required", 400);
  }

  try {
    // CHECK IF EMAIL EXISTS
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return errorResponse(res, "Database error");

      if (results.length > 0) {
        return errorResponse(res, "Email already exists", 400);
      }

      try {
        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // DEFAULT ROLE
        const userRole = role || "member";

        // INSERT USER
        db.query(
          "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
          [full_name, email, hashedPassword, userRole],
          (err) => {
            if (err) return errorResponse(res, "Failed to register user");

            return successResponse(res, "Account created successfully");
          }
        );

      } catch (hashError) {
        return errorResponse(res, "Password hashing failed");
      }
    });

  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error");
  }
};


// ================= LOGIN =================
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, "Email and password are required", 400);
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return errorResponse(res, "Database error");

    if (results.length === 0) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    return successResponse(res, "Login successful", {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role, // 🔥 VERY IMPORTANT
    });
  });
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, "Email is required", 400);
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return errorResponse(res, "Database error");

    if (results.length === 0) {
      return errorResponse(res, "Email not found", 404);
    }

    try {
      // 🔐 Generate token
      const token = crypto.randomBytes(32).toString("hex");

      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

      // 💾 Save token
      db.query(
        "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?",
        [token, expiry, email],
        async (err) => {
          if (err) return errorResponse(res, "Database error");

          const resetLink = `http://localhost:3000/reset-password/${token}`;

          console.log("🔗 RESET LINK:", resetLink);

          try {
            await sendEmail(
              email,
              "Reset Your Password",
              `
              <h2>Password Reset</h2>
              <p>You requested to reset your password.</p>
              <p>Click the link below:</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>This link will expire in 15 minutes.</p>
              `
            );

            console.log("✅ RESET EMAIL SENT TO:", email);

            return successResponse(res, "Reset email sent");

          } catch (emailError) {
            console.error("❌ EMAIL FAILED:", emailError);
            return errorResponse(res, "Failed to send email", 500);
          }
        }
      );

    } catch (error) {
      console.error(error);
      return errorResponse(res, "Server error");
    }
  });
};