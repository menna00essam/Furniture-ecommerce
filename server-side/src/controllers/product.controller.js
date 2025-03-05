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
  let { category_id } = req.params;
  let { limit = 16, page = 1, order = "desc" } = req.query;
  console.log(category_id);

  // Ensure valid pagination inputs
  limit = Math.max(1, limit);
  page = Math.max(1, page);

  if (!mongoose.isValidObjectId(category_id)) {
    return next(
      new AppError("Invalid Category ID format.", 400, httpStatusText.FAIL)
    );
  }

  if (!category_id) {
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
  const totalProducts = await Product.countDocuments({
    productCategories: category_id,
  });

  // Fetch products with pagination and sorting
  const products = await Product.find({ productCategories: category_id })
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

const getProductById = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  console.log(product_id);

  const product = await Product.findById(product_id)
    .select(
      "_id productName productSubtitle productImages productPrice productQuantity productDate productSale productCategories productDescription colors sizes brand"
    )
    .populate("_id");

  if (!product) {
    return next(new AppError("Product not found", 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      product,
    },
  });
});

const getProductForComparison = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  console.log("Fetching product for comparison with ID:", product_id);

  if (!product_id) {
    return next(
      new AppError("Product ID is required", 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select(
      "_id productName productSubtitle productImages productPrice productQuantity productDate productSale productCategories productDescription colors sizes brand additionalInformation"
    )
    .populate("_id");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      product,
    },
  });
});

const getAllProductNamesAndIds = asyncWrapper(async (req, res, next) => {
  const products = await Product.find().select("_id productName");

  console.log("Products Found");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      products: products.map((product) => ({
        product_id: product._id,
        productName: product.productName,
      })),
    },
  });
});

module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getAllProductNamesAndIds,
  getProductForComparison,
};
