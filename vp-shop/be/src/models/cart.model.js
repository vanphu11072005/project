const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");         // Ánh xạ sang kiểu dữ liệu thật của MySQL (hoặc PostgreSQL, SQLite...).

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  tableName: "carts",
  timestamps: false       // Nghĩa là Sequelize sẽ không tự động thêm cột createdAt và updatedAt nữa.
});

module.exports = Cart;
