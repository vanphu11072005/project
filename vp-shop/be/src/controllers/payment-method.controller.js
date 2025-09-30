const PaymentMethod = require("../models/payment-method.model");

// Lấy danh sách tất cả phương thức thanh toán
const getAllPaymentMethods = async (req, res) => {
    try {
        const methods = await PaymentMethod.findAll({ where: { is_active: true } });
        res.json(methods);
    } catch (error) {
        consolo.error(error);
        res.status(500).json({ message: "Lỗi payment-method controller" });
    }
};

const getPaymentMethodById = async (req, res) => {
    try {
        const { id } = req.params;
        const method = await PaymentMethod.findByPk(id);
        if (!method) return res.status(404).json({ messagse: "Không tìm thấy phương thức" });
        res.json(method); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi payment-method controller" });
    }
};

module.exports = { getAllPaymentMethods, getPaymentMethodById };