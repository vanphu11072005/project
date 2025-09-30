const PaymentTransaction = require("../models/payment-transaction.model");
const { Order } = require("../models/order.model");
const PaymentMethod = require("../models/payment-method.model");

// Tạo giao dịch thanh toán mới
const createTransaction = async (req, res) => {
  try {
    const { order_id, payment_method_id, amount, transaction_id } = req.body;

    // Kiểm tra order tồn tại
    const order = await Order.findByPk(order_id);
    if (!order) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    // Kiểm tra payment method tồn tại
    const method = await PaymentMethod.findByPk(payment_method_id);
    if (!method) return res.status(404).json({ message: "Phương thức thanh toán không tồn tại" });

    const transaction = await PaymentTransaction.create({
      order_id,
      payment_method_id,
      amount,
      transaction_id,
      status: "pending" // mặc định
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi payment-transaction" });
  }
};

// Lấy tất cả giao dịch của 1 đơn hàng
const getTransactionsByOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const transactions = await PaymentTransaction.findAll({
      where: { order_id },
      include: [{ model: PaymentMethod, as: "payment_method" }]
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi payment-transaction" });
  }
};

module.exports = { createTransaction, getTransactionsByOrder };
