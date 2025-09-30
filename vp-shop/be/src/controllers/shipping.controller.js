const Shipping = require("../models/shipping.model");

const getShippings = async (req, res) => {
  try {
    const shippings = await Shipping.findAll();
    res.json(shippings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getShippings };
