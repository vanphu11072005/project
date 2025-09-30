const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");         // Ánh xạ sang kiểu dữ liệu thật của MySQL (hoặc PostgreSQL, SQLite...).

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(191), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM("customer", "admin"), defaultValue: "customer" },
  avatar: { type: DataTypes.STRING(255), allowNull: false }
}, {
  tableName: "users",
  timestamps: false       // Nghĩa là Sequelize sẽ không tự động thêm cột createdAt và updatedAt nữa.
});

module.exports = User;
