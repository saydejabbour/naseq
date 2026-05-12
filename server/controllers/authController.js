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
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return errorResponse(res, "Database error");

      if (results.length > 0) {
        return errorResponse(res, "Email already exists", 400);
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role || "member";
        const stylistStatus = userRole === "stylist" ? "pending" : null;

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpires = new Date(Date.now() + 60 * 60 * 1000);

        db.query(
          `INSERT INTO users 
          (full_name, email, password_hash, role, stylist_status, is_verified, verification_token, verification_expires) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            full_name,
            email,
            hashedPassword,
            userRole,
            stylistStatus,
            false,
            verificationToken,
            verificationExpires,
          ],
          async (err, insertResult) => {
            if (err) {
              console.error("REGISTER ERROR:", err);
              return errorResponse(res, "Failed to register user");
            }

            const newUserId = insertResult.insertId;

            if (userRole === "stylist") {
              await db.promise().query(
                `INSERT INTO stylist_profiles 
                 (user_id, name, bio, profile_photo, status)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                  newUserId,
                  full_name,
                  "",
                  "",
                  "Pending",
                ]
              );
            }

            const verifyLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

            try {
              await sendEmail(
                email,
                "Verify Your Account",
                `
                <h2>Welcome to Naseq 👗</h2>
                <p>Please verify your email:</p>
                <a href="${verifyLink}">Verify Account</a>
                <p>This link expires in 1 hour.</p>
                `
              );
            } catch (emailError) {
              console.error("❌ EMAIL FAILED:", emailError);
            }

            return successResponse(
              res,
              userRole === "stylist"
                ? "Account created. After email verification, your stylist account will be pending admin approval."
                : "Account created. Please verify your email."
            );
          }
        );
      } catch (hashError) {
        console.error("REGISTER HASH/PROFILE ERROR:", hashError);
        return errorResponse(res, "Registration failed");
      }
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Server error");
  }
};

// ================= VERIFY EMAIL =================
export const verifyEmail = (req, res) => {
  const { token } = req.params;

  db.query(
    `SELECT * FROM users 
     WHERE verification_token = ? 
     AND verification_expires > NOW()`,
    [token],
    (err, results) => {
      if (err) return errorResponse(res, "Database error");

      if (results.length === 0) {
        return errorResponse(res, "Invalid or expired token", 400);
      }

      db.query(
        `UPDATE users 
         SET is_verified = true,
             verification_token = NULL,
             verification_expires = NULL
         WHERE verification_token = ?`,
        [token],
        (err) => {
          if (err) return errorResponse(res, "Verification failed");

          console.log("✅ EMAIL VERIFIED");

          return res.redirect("http://localhost:3000/login");
        }
      );
    }
  );
};

// ================= LOGIN =================
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, "Email and password are required", 400);
  }

  const query = `
    SELECT
      u.*,
      sp.profile_photo
    FROM users u
    LEFT JOIN stylist_profiles sp
      ON u.user_id = sp.user_id
    WHERE u.email = ?
  `;

  db.query(query, [email], async (err, results) => {
    if (err) return errorResponse(res, "Database error");

    if (results.length === 0) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const user = results[0];

    if (!user.is_verified) {
      return errorResponse(res, "Please verify your email first", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    return successResponse(res, "Login successful", {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      stylist_status: user.stylist_status,
      profile_photo: user.profile_photo,
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
      const token = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 15 * 60 * 1000);

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

// ================= RESET PASSWORD =================
export const resetPassword = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    return errorResponse(res, "Token is required", 400);
  }

  if (!password) {
    return errorResponse(res, "Password is required", 400);
  }

  db.query(
    `SELECT * FROM users 
     WHERE reset_token = ? 
     AND reset_token_expiry > NOW()`,
    [token],
    async (err, results) => {
      if (err) {
        console.error("RESET SELECT ERROR:", err);
        return errorResponse(res, "Database error");
      }

      if (results.length === 0) {
        return errorResponse(res, "Invalid or expired reset link", 400);
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `UPDATE users 
           SET password_hash = ?,
               reset_token = NULL,
               reset_token_expiry = NULL
           WHERE reset_token = ?`,
          [hashedPassword, token],
          (err) => {
            if (err) {
              console.error("RESET UPDATE ERROR:", err);
              return errorResponse(res, "Failed to reset password");
            }

            console.log("✅ PASSWORD RESET SUCCESSFUL");

            return successResponse(res, "Password reset successful");
          }
        );
      } catch (hashError) {
        console.error("RESET HASH ERROR:", hashError);
        return errorResponse(res, "Password hashing failed");
      }
    }
  );
};