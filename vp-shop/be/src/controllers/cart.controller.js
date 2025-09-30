const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ JWT middleware
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ message: "productId required" });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // kiểm tra stock
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    // nếu đã có item trong cart -> tăng quantity
    let item = await Cart.findOne({ where: { user_id: userId, product_id: productId } });

    if (item) {
      const newQty = item.quantity + Number(quantity);        // item.quantity là số lượng sản phẩm hiện tại có trong giỏ hàng(lấy từ DB). (quantity) là số lượng sản phẩm mà người dùng bấm Add to cart tiếp
      if (newQty > product.stock) return res.status(400).json({ message: "Exceeds available stock" });
      item.quantity = newQty;
      await item.save();
    } else {
      item = await Cart.create({ user_id: userId, product_id: productId, quantity });
    }

    // lấy lại bản ghi giỏ hàng vừa thêm/cập nhật, nhưng kèm luôn thông tin sản phẩm (Product) liên quan để trả về cho frontend.
    const itemWithProduct = await Cart.findByPk(item.id, { include: [{ model: Product, as: "product" }] });
    res.status(201).json(itemWithProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    // authorize: chỉ user đó hoặc admin
    if (Number(req.user.id) !== Number(userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const items = await Cart.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: "product" }]
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { quantity } = req.body;

    const item = await Cart.findByPk(cartId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    // authorize
    if (Number(item.user_id) !== Number(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const product = await Product.findByPk(item.product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (Number(quantity) <= 0) return res.status(400).json({ message: "Quantity must be >= 1" });
    if (quantity > product.stock) return res.status(400).json({ message: "Not enough stock" });

    item.quantity = quantity;
    await item.save();

    const updated = await Cart.findByPk(cartId, { include: [{ model: Product, as: "product" }] });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const cartId = req.params.id;
    const item = await Cart.findByPk(cartId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    if (Number(item.user_id) !== Number(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await item.destroy();
    res.json({ message: "Deleted", id: cartId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addToCart, getCartByUserId, updateCartItem, deleteCartItem };
