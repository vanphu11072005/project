const jwt = require("jsonwebtoken");
require("dotenv").config();

// Kiểm tra token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];             // Req sẽ có header = Authorization: Bearer <jwt_token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token không tồn tại" });

  jwt.verify(token, process.env.JWT_SECRET || "secret123", (err, user) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = user;   // gắn thông tin user vào req
    next();
  });
};

// Middleware cho admin
const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới được phép" });
  }
  next();
};

// Middleware cho user
const verifyUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Chỉ customer mới được phép" });
  }
  next();
}

module.exports = { verifyToken, verifyAdmin, verifyUser };
