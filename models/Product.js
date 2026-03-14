const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true ,trim: true},
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
