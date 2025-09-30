const express = require("express");
const router = express.Router();
const { register, login, me } = require("../../controllers/auth.controller");
const { verifyToken, verifyUser } = require("../../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, verifyUser, me);

module.exports = router;
