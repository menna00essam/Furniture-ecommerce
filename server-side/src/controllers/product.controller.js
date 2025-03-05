const mongoose = require("mongoose");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Product = require("../models/product.model");
const asyncWrapper = require("../middlewares/asyncWrapper.middleware");

// - get all  pagination -16 default ✔
// - get a product by id
// - get all products by category -- pagination 16  -- related product section in product page
// - get products full data for compariosn
// - get all-products (name and id ) usred in search
// - get all products by search -- pagination 16



// get a product by id


const getProductById = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;

  const product = await Product.findById(product_id)
  .select("productName productSubtitle productImages productPrice productQuantity productDate productSale productCategories productDescription colors sizes brand")
  .populate(
    "productCategories"
  );

  if (!product) {
    return next(new AppError("Product not found", 404 , httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
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

const getAllProducts = asyncWrapper(async (req, res, next) => {
  let { limit = 16, page = 1, order = "desc" } = req.query;
  console.log("query", limit, page);

  limit = Math.max(1, limit);
  page = Math.max(1, page);

  if (isNaN(limit) || isNaN(page)) {
    return next(
      new AppError(
        "Invalid pagination parameters. 'limit' and 'page' must be positive numbers.",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const skip = (page - 1) * limit;
  const totalProducts = await Product.countDocuments();
  const sortOrder = order === "asc" ? 1 : -1;

  const products = await Product.find()
    .select(
      "_id productName productSubtitle productImages productPrice productDate productSale"
    )
    .limit(limit)
    .skip(skip)
    .sort({ productDate: sortOrder });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { totalProducts, products },
  });
});

const getProductsByCategory = asyncWrapper(async (req, res, next) => {
  let categoryId = req.params;
  let { limit = 16, page = 1, order = "desc" } = req.query;

  // Ensure valid pagination inputs
  limit = Math.max(1, limit);
  page = Math.max(1, page);

  if (!categoryId) {
    return next(
      new AppError("Category ID is required.", 400, httpStatusText.FAIL)
    );
  }

  if (isNaN(limit) || isNaN(page)) {
    return next(
      new AppError(
        "Invalid pagination parameters. 'limit' and 'page' must be positive numbers.",
        400,
        httpStatusText.FAIL
      )
    );
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;
  const totalProducts = await Product.countDocuments({ categoryId });

  // Fetch products with pagination and sorting
  const products = await Product.find({ categoryId })
    .select(
      "_id productName productSubtitle productImages productPrice productDate productSale"
    )
    .limit(limit)
    .skip(skip)
    .sort({ productDate: sortOrder });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { totalProducts, products },
  });
});

module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductById
};
