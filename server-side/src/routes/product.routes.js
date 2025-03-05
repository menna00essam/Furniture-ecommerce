const express = require("express");
const productController = require("../controllers/product.controller");
const router = express.Router();

router.route("/").get(productController.getAllProducts);
router.route("/all").get(productController.getAllProductNamesAndIds); // - get all-products (name and id ) usred in search
router.route("/:product_id").get(productController.getProductById);
router
  .route("/category/:category_id")
  .get(productController.getProductsByCategory);
router
  .route("/comparison/:product_id")
  .get(productController.getProductForComparison); // - get products full data for compariosn

module.exports = router;
