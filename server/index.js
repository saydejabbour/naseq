import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import clothingRoutes from "./routes/clothingRoutes.js";
import outfitRoutes from "./routes/outfitsRoutes.js";
import contactRoutes from "./routes/contact.js"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔥 EXISTING ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/outfits", outfitRoutes);

// 🔥 NEW CONTACT ROUTE (IMPORTANT)
app.use("/api/contact", contactRoutes);    

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});