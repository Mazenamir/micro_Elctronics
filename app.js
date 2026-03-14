require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const port = process.env.PORT || 4000;

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

dbConnect();

// Require Routes
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");


// Use Routes
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});