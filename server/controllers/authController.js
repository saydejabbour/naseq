import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "../utils/response.js";

// REGISTER
export const register = async (req, res) => {
  const { full_name, email, password } = req.body;

  // VALIDATION
  if (!full_name || !email || !password) {
    return errorResponse(res, "All fields are required", 400);
  }

  try {
    // CHECK IF EMAIL EXISTS
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], async (err, results) => {
      if (err) return errorResponse(res, "Database error");

      if (results.length > 0) {
        return errorResponse(res, "Email already exists", 400);
      }

      // HASH PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery =
        "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)";

      db.query(
        insertQuery,
        [full_name, email, hashedPassword, "member"],
        (err, result) => {
          if (err) return errorResponse(res, "Failed to register user");

          return successResponse(res, "Account created successfully");
        }
      );
    });
  } catch (error) {
    return errorResponse(res, "Server error");
  }
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, "Email and password are required", 400);
  }

  const query = "SELECT * FROM users WHERE email = ?";
  

  db.query(query, [email], async (err, results) => {
          console.log("USER FROM DB:", results);

    
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
    });
  });
};