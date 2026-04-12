import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // ✅ ADD THIS

// 🔥 EXISTING ROUTES
import authRoutes from "./routes/authRoutes.js";
import clothingRoutes from "./routes/clothingRoutes.js";
import outfitRoutes from "./routes/outfitsRoutes.js";
import contactRoutes from "./routes/contact.js";
<<<<<<< HEAD

// 🔥 NEW STYLIST ROUTE
import stylistRoutes from "./routes/stylistRoutes.js";
=======
>>>>>>> 027c5f8b06f00ee07065f9abfeb3e18be4f72c45

dotenv.config();

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// 🔥 SERVE UPLOADED IMAGES (STEP 5)
=======
// ✅ SERVE UPLOADED IMAGES (VERY IMPORTANT)
>>>>>>> 027c5f8b06f00ee07065f9abfeb3e18be4f72c45
app.use("/uploads", express.static("uploads"));

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/contact", contactRoutes);
<<<<<<< HEAD

// 🔥 NEW STYLIST ROUTE (STEP 4)
app.use("/api/stylist", stylistRoutes);
=======
>>>>>>> 027c5f8b06f00ee07065f9abfeb3e18be4f72c45

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});