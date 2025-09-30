const sequelize = require("../config/database");
const { DataTypes } = require("sequelize"); 

const PaymentTransaction = sequelize.define("PaymentTransaction", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    payment_method_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM("pending", "success", "failed"), allowNull: false, defaultValue: "pending"},
    transaction_id: { type: DataTypes.STRING(100), allowNull: true }
}, {
    tableName: "payment_transactions",
    timestamps: false
});

module.exports = PaymentTransaction;