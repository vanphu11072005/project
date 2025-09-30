const express = require("express");             // Express giúp tạo server nhanh, có router, middleware, xử lý request/response gọn hơn so với Node.js thuần.
const cors = require("cors");                   // Cho phép FE gọi API từ BE.
const { sequelize } = require("./models");      // Mục đích: kiểm tra hoặc sync database.
require("dotenv").config();

// Routes user
const userAuthRoutes = require("./routes/user/auth.route");
const userUserRoutes = require("./routes/user/user.route");
const userProductRoutes = require("./routes/user/product.route");
const userCartRoutes = require("./routes/user/cart.route");
// const adminOrderRoutes = require("./routes/user/order.route");
const userOrderRoutes = require("./routes/user/order.route");
const userCategoryRoutes = require("./routes/user/category.route");
const userShippingRoutes = require("./routes/user/shipping.route");
const userPaymentRoutes = require("./routes/user/payment.route")

// Routes admin
// const adminAuthRoutes = require("./routes/admin/auth.route");


const app = express();
app.use(cors());                                // Ngăn lỗi CORS ở phía client.
app.use(express.json());                        // Dùng để phân tích (parse) body của request khi client gửi JSON.

// Routes user
app.use("/auth", userAuthRoutes);
app.use("/users", userUserRoutes);
app.use("/products", userProductRoutes);
app.use("/carts", userCartRoutes);
app.use("/orders", userOrderRoutes);
app.use("/categories", userCategoryRoutes);
app.use("/shippings", userShippingRoutes);
app.use("/payments", userPaymentRoutes);

// Routes admin
// app.use("/admin/auth", adminAuthRoutes);
// app.use("/admin/orders", adminOrderRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Shop backend is running 🚀" });
});

// connect DB
sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB connection failed:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
