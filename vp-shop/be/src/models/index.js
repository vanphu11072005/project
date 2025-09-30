const sequelize = require("../config/database");

const User = require("./user.model");
const Product = require("./product.model");
const Cart = require("./cart.model");
const { Order, OrderItem } = require("./order.model");
const Category = require("./category.model");
const Shipping = require("./shipping.model");
const PaymentMethod = require("./payment-method.model");
const PaymentTransaction = require("./payment-transaction.model");

// ----------------- Associations -----------------
//User <-> Cart
User.hasMany(Cart, { foreignKey: "user_id", as: "carts" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Product <-> Cart
Product.hasMany(Cart, { foreignKey: "product_id", as: "carts" });
Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// User <-> Order
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: "product_id", as: "order_items" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Category <-> Product
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Shipping <-> Order
Shipping.hasMany(Order, { foreignKey: "shipping_id", as: "orders" });
Order.belongsTo(Shipping, { foreignKey: "shipping_id", as: "shipping" });

// PaymentMethod <-> PaymentTransaction
PaymentMethod.hasMany(PaymentTransaction, { foreignKey: "payment_method_id", as: "transactions" });
PaymentTransaction.belongsTo(PaymentMethod, { foreignKey: "payment_method_id", as: "payment_method" });

// Order <-> PaymentMethod
PaymentMethod.hasMany(Order, { foreignKey: "payment_method_id", as: "orders" });
Order.belongsTo(PaymentMethod, { foreignKey: "payment_method_id", as: "payment_method" });

// Order <-> PaymentTransaction
Order.hasMany(PaymentTransaction, { foreignKey: "order_id", as: "transactions" });
PaymentTransaction.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// ----------------- Export -----------------
module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  Order,
  OrderItem,
  Category,
  Shipping,
  PaymentMethod,
  PaymentTransaction
};
