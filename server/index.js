import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// 🔥 ROUTES
import authRoutes from "./routes/authRoutes.js";
import clothingRoutes from "./routes/clothingRoutes.js";
import outfitRoutes from "./routes/outfitsRoutes.js";
import contactRoutes from "./routes/contact.js";
import stylistRoutes from "./routes/stylistRoutes.js";
import savedTemplatesRoutes from "./routes/savedTemplatesRoutes.js";

dotenv.config();

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔥 SERVE UPLOADED IMAGES
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
app.use("/api/stylist", stylistRoutes);
app.use("/api/saved-templates", savedTemplatesRoutes);

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});