const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");         // Ánh xạ sang kiểu dữ liệu thật của MySQL (hoặc PostgreSQL, SQLite...).

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  status: { type: DataTypes.ENUM("pending","paid","shipped","completed","cancelled"), defaultValue: "pending" },
  shipping_id: { type: DataTypes.INTEGER, allouNull: false },
  payment_method_id: { type: DataTypes.INTEGER, allowNull: false },
  payment_status: { type: DataTypes.ENUM("pending, paid, failed"), allowNull: false, default: "pending" }
}, { 
    tableName: "orders",
    timestamps: true,
    underscored: true
});

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, { 
    tableName: "order_items", 
    timestamps: false 
});

module.exports = { Order, OrderItem };
