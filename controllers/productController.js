const Product = require("../Models/Product");
const User = require("../Models/User");

// app.post("/products", async (req, res) => {
const createProduct = async (req, res) => {
  try {
    const { name, stock, price, roleid } = req.body;
    if (!name || stock == null || price == null || !roleid) {
      return res
        .status(400)
        .json({ message: "Error: Missed Data. All fields are required" });
    }

    // const test = await User.findById(roleid);
    // if (!test || test.role !== "admin") {
    //   return res
    //     .status(400)
    //     .json({ message: "Error: Only admin can create products" });
    // }

    //
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    let decoded;

    
    // Create new product
    const product = await Product.create({ name, stock, price });
    console.log("Received product data:", product);

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.log(err);
  }
};

// GET
// app.get("/products", async (req, res) => {
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(req.query);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.log(error);
  }
};

//search and filter
// app.get("/products/:name", async (req, res) => {
const getProductByName = async (req, res) => {
  try {
    const products = await Product.find({
      name: req.params.name.toLowerCase(),
    });
    if (products.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res
      .status(200)
      .json({
        msg: "Product fetched  successfully",
        success: true,
        count: products.length,
        data: products,
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createProduct, getProducts, getProductByName };
