const Product = require("../models/product.model");
const { OrderItem } = require("../models/order.model");
const { Op, fn, col } = require("sequelize");

// Lấy danh sách sản phẩm với filter, search, pagination
const getProducts = async (req, res) => {
  try {
    const { search, size, color, category } = req.query;      // req.query là object chứa các tham số query string từ URL, ví dụ URL GET /products?
    let { page = 1, limit = 3 } = req.query;
    
    page = Math.max(1, Number(page) || 1);
    limit = Math.max(1, Math.min(Number(limit) || 3, 100)); // giới hạn max 100
    
    const where = {};

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.name = { [Op.like]: `%${q}%` };
    }

    if (category) {
      where.category_id = Number(category);
    }

    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["created_at", "DESC"]]
    });

    res.json({
      total: products.count,
      page: Number(page),
      pageSize: Number(limit),
      data: products.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết sản phẩm theo id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product không tồn tại" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách sản phẩm bán chạy
const getBestSellers = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const bestSellers = await OrderItem.findAll({
      attributes: [
        "product_id",
        [fn("SUM", col("quantity")), "totalSold"]
      ],
      include: [
        {
          model: Product,
          as: "product", // cần alias đúng khi định nghĩa association
        }
      ],
      group: ["product_id", "product.id"],
      order: [[fn("SUM", col("quantity")), "DESC"]],
      limit,
    });

    res.json(bestSellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, getBestSellers };
