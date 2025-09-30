const sequelize = require("../config/database")
const { DataTypes } = require("sequelize");

const Shipping = sequelize.define("Shipping", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estimated_days: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: "shippings",
    timestamps: false   
});

module.exports = Shipping;