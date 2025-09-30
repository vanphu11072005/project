const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../../middlewares/auth.middleware");
const { createOrder, getOrdersByUser, getAllOrders } = require("../../controllers/order.controller");

// Tạo đơn
router.post("/", verifyToken, createOrder);

// Lấy tất cả đơn (admin)
router.get("/", verifyToken, verifyAdmin, getAllOrders);

// Lấy đơn theo user
router.get("/:userId", verifyToken, getOrdersByUser);

module.exports = router;
