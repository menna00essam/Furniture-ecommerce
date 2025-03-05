// - get all  pagination -16 default
// - get a product by id
// - get all products by category -- pagination 16  -- related product section in product page
// - get products full data for compariosn
// - get all-products (name and id ) usred in search
// - get all products by search -- pagination 16

const Product = require("../models/product.model");
const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const AppError = require("../utils/appError");

exports.getProductById = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;

  const product = await Product.findById(product_id)
  .select("productName productSubtitle productImages productPrice productQuantity productDate productSale productCategories productDescription colors sizes brand")
  .populate(
    "productCategories"
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

 /* const product = await Product.aggregate([
  { $match: { _id: product_id } }, 
  {
    $lookup: {
      from: "categories", 
      localField: "productCategories",
      foreignField: "_id",
      as: "productCategories",
    },
  },
  {
    $project: {
      productName: 1,
      productSubtitle: 1,
      productImages: 1,
      productPrice: 1,
      productQuantity: 1,
      productDate: 1,
      productSale: 1,
      productCategories: 1,
      productDescription: 1,
      colors: 1,
      sizes: 1,
      brand: 1,
    },
  },
]);*/