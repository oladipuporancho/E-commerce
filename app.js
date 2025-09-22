require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const kycRoutes = require("./src/routes/kycRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.send("BNPL E-commerce API is running");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/kyc", kycRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);

// Start server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(` Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(" DB sync error:", err));
