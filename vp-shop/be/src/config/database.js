const { Sequelize } = require("sequelize");
require("dotenv").config();             // Dùng thư viện dotenv để load các biến môi trường từ file .env.

const sequelize = new Sequelize(        // Tạo một instance của Sequelize để kết nối tới database
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,          // Địa chỉ server chứa DB (ví dụ: "localhost").
    dialect: process.env.DB_DIALECT,    // Loại DB mà Sequelize sẽ kết nối ở đây là mysql
    logging: false,                     // Tắt in SQL ra console
  }
);

module.exports = sequelize;
