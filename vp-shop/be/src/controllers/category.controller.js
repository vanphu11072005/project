const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Lấy tất cả categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{ model: Product, as: "products" }]
        });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy 1 category + products thuộc category
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{ model: Product, as: "products" }]
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getCategories, getCategoryById };
