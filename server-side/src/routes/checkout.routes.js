const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout.controller");
router.route("/").post(checkoutController.placeOrder);

module.exports = router;
