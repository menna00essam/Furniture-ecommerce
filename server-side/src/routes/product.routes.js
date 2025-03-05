const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();

router.route("/").get(productController.getAllProducts);
router.route("/:product_id").get();
router.route("/category/:category_id").get(productController.getProductsByCategory);
router.route("/comparison").get(); // - get products full data for compariosn
router.route("/all").get(); // - get all-products (name and id ) usred in search

module.exports = router;
