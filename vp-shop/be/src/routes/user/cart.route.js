const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/auth.middleware");
const { addToCart, getCartByUserId, updateCartItem, deleteCartItem } = require("../../controllers/cart.controller");

router.post("/", verifyToken, addToCart);             // verifyToken kiểm tra request có JWT token hợp lệ không. Bảo vệ route
router.get("/:userId", verifyToken, getCartByUserId);
router.put("/:id", verifyToken, updateCartItem);
router.delete("/:id", verifyToken, deleteCartItem);

module.exports = router;
