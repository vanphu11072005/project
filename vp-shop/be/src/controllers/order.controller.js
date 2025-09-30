const { sequelize } = require("../models");
const Cart = require("../models/cart.model");
const { Order, OrderItem } = require("../models/order.model");
const User = require("../models/user.model");
const Shipping = require("../models/shipping.model");
const PaymentMethod = require("../models/payment-method.model");
const PaymentTransaction = require("../models/payment-transaction.model");

// Tạo đơn hàng
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { address, phone, shipping_id, payment_method_id } = req.body;

    const shipping = await Shipping.findByPk(shipping_id);
    if (!shipping) {
      return res.status(400).json({ message: "Invalid shipping method" });
    }

    const paymentMethod = await PaymentMethod.findByPk(payment_method_id);
    if (!paymentMethod || !paymentMethod.is_active) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: ["product"]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    // Tính tổng tiền & check tồn kho
    let total = 0;
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        await t.rollback();
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.product.name}` });
      }
      total += Number(item.product.price) * item.quantity;
    }

    total += Number(shipping.fee); // Cộng phí ship

    // ✅ tạo order (lưu ý total_price)
    const order = await Order.create(
      {
        user_id: userId,
        address,
        phone,
        total_price: total,
        status: "pending",
        shipping_id,
        payment_method_id,
        payment_status: "pending",
      },
      { transaction: t }
    );

    // tạo order items & trừ stock
    for (const item of cartItems) {
      await OrderItem.create(
        {
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        },
        { transaction: t }
      );

      item.product.stock -= item.quantity;
      await item.product.save({ transaction: t });
    }

    // clear cart
    await Cart.destroy({ where: { user_id: userId }, transaction: t });

    await t.commit();

    // ⚡ Trả order có created_at
    const orderWithDate = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: "items", include: ["product"] },
        { model: Shipping, as: "shipping" },
        { 
          model: PaymentTransaction, 
          as: "transactions", 
          include: ["payment_method"] 
        }
      ]
    });

    res.status(201).json(orderWithDate);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Lịch sử đơn của user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (Number(req.user.id) !== Number(userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        { model: OrderItem, as: "items", include: ["product"] },
        { model: Shipping, as: "shipping" },
        { 
          model: PaymentTransaction, 
          as: "transactions", 
          include: ["payment_method"] 
        }
      ],
      order: [["created_at", "DESC"]]
    });    

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: tất cả đơn
const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: "items", include: ["product"] },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Shipping, as: "shipping" },
        { 
          model: PaymentTransaction, 
          as: "transactions", 
          include: ["payment_method"] 
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error getAllOrders:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrdersByUser, getAllOrders };
