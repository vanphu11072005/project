const sequelize = require("../config/database");
const { DataTypes } = require("sequelize"); 

const Category = sequelize.define("Category", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false},
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING(255)}
}, {
    tableName: "categories",
    timestamps: false
});

module.exports = Category;