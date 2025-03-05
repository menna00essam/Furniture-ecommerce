const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
router.route("/").get();
router.route("/:product_id").get(productController.getProductById);
router.route("/category/:category_id").get();
router.route("/comparison").get(); // - get products full data for compariosn
router.route("/all").get(); // - get all-products (name and id ) usred in search

module.exports = router;
