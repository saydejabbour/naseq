import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 🔥 EXISTING ROUTES
import authRoutes from "./routes/authRoutes.js";
import clothingRoutes from "./routes/clothingRoutes.js";
import outfitRoutes from "./routes/outfitsRoutes.js";
import contactRoutes from "./routes/contact.js";

// 🔥 NEW STYLIST ROUTE
import stylistRoutes from "./routes/stylistRoutes.js";

dotenv.config();

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 SERVE UPLOADED IMAGES (STEP 5)
app.use("/uploads", express.static("uploads"));

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔥 EXISTING ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/contact", contactRoutes);

// 🔥 NEW STYLIST ROUTE (STEP 4)
app.use("/api/stylist", stylistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});