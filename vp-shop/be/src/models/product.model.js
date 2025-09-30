const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");         // Ánh xạ sang kiểu dữ liệu thật của MySQL (hoặc PostgreSQL, SQLite...).

const Product = sequelize.define("Product",{
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  image_url: { type: DataTypes.STRING(255) },
  category_id: { type: DataTypes.INTEGER, allowNull: false}
},
{
  tableName: "products",
  timestamps: false
});

module.exports = Product;
