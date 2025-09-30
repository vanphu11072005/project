const express = require("express");
const router = express.Router();
const { getAllPaymentMethods, getPaymentMethodById} = require("../../controllers/payment-method.controller");
const { createTransaction, getTransactionsByOrder } = require("../../controllers/payment-transaction.controller");

// Payment Methods
router.get("/methods", getAllPaymentMethods);
router.get("methods/:id", getPaymentMethodById);

// Payment Transactions
router.post("/transactions", createTransaction);
router.get("/transaction/order/:order_id", getTransactionsByOrder);

module.exports = router;