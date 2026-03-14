const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const User = require("../Models/User");

const addToCart = async (req, res) => {
  try {
    //get data from request body
    // const { userId, productId, quantity } = req.body;
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming you have user authentication and the user ID is available in req.user.id

    // Validate input
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ msg: "Quantity must be greater than 0" });
    }

    // check user existance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found!!" });
    }
    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found!!" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Not enough stock available!!" });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      const newCart = await Cart.create({ userId, items: [] });
      cart = newCart;
      console.log("Received cart data:", newCart);
    }
    // res.status(201).json({
    //   message: "Cart created successfully",
    //   data: newCart,
    // });

    // add product or update quantity in cart
    // const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    // Check if product is already in cart
    const existingItemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId),
    ); // Use equals for ObjectId comparison
    if (existingItemIndex > -1) {
      // Update quantity if product is already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ productId: productId, quantity });
    }
    // Save cart
    await cart.save();
    // Decrease product stock
    product.stock -= quantity;
    await product.save();

    await cart.populate("items.productId");

    // Optionally, you can also return the updated cart or the total price here
    const totalPrice = calculateTotalPrice(cart);
    res.status(200).json({
      msg: "Product added to cart successfully!!",
      success: true,
      count: cart.items.length,
      data: cart,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
  }
};

const calculateTotalPrice = (cart) => {
  let totalPrice = 0;
  for (const item of cart.items) {
    if (item.productId) {
      totalPrice += item.productId.price * item.quantity;
    }
  }
  return totalPrice;
};

const getCartItems = async (req, res) => {
  try {
    // const { userId } = req.query;
    const userId = req.user.id; // Assuming you have user authentication and the user ID is available in req.user.id
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required!!" });
    }
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found!!" });
    }
    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.log(error);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ msg: "Quantity is required!!" });
    }
    if (quantity <= 0) {
      return res.status(400).json({ msg: "Quantity must be greater than 0" });
    }
    const cart = await Cart.findOne({ "items._id": itemId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart item not found!!" });
    }
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found!!" });
    }
    if (product.stock + item.quantity < quantity) {
      return res.status(400).json({ msg: "Not enough stock available!!" });
    }
    // Update stock
    product.stock += item.quantity - quantity; // Return stock for old quantity and reduce for new quantity
    await product.save();

    // Update cart item quantity
    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");
    const totalPrice = calculateTotalPrice(cart);

    res.status(200).json({
      success: true,
      msg: "Cart item updated successfully",
      count: cart.items.length,
      data: cart,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
  }
};

const removeItemCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ "items._id": itemId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart item not found!!" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found!!" });
    }

    // Update stock
    product.stock += item.quantity;
    await product.save();

    // Remove item from cart
    item.remove();
    await cart.save();
    await cart.populate("items.productId");
    const totalPrice = calculateTotalPrice(cart);
    res.status(200).json({
      success: true,
      msg: "Cart item removed successfully!!",
      count: cart.items.length,
      data: cart,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeItemCart,
  calculateTotalPrice,
};
