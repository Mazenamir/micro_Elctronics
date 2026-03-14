const express = require('express');
const authMiddelware = require('../Middelwares/authMiddelware');
const router = express.Router();
const { addToCart, getCartItems, updateCartItem, removeItemCart } = require('../Controllers/cartController');


router.post('/add', authMiddelware, addToCart);
router.get('/items', authMiddelware, getCartItems);
router.put('/update/:itemId', authMiddelware, updateCartItem);
router.delete('/remove/:itemId', authMiddelware, removeItemCart);

module.exports = router;