const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");  

const PaymentMethod = sequelize.define("PaymentMethod", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    tableName: "payment_methods",
    timestamps: false
});

module.exports = PaymentMethod;