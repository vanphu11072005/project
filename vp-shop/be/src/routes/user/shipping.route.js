const express = require("express");
const { getShippings } = require("../../controllers/shipping.controller");
const router = express.Router();

router.get("/", getShippings);

module.exports = router;