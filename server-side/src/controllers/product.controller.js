const mongoose = require('mongoose');
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const Product = require('../models/product.model');
const asyncWrapper = require('../middlewares/asyncWrapper.middleware');

// - get a product by id
// - get products full data for compariosn
// - get all-products (name and id ) usred in search
// - get all products by search -- pagination 16

// const getAllProducts = asyncWrapper(async (req, res, next) => {
//   let { limit = 16, page = 1, order = 'desc' } = req.query;

//   limit = Math.max(1, limit);
//   page = Math.max(1, page);

//   if (isNaN(limit) || isNaN(page)) {
//     return next(
//       new AppError(
//         "Invalid pagination parameters. 'limit' and 'page' must be positive numbers.",
//         400,
//         httpStatusText.FAIL
//       )
//     );
//   }

//   const skip = (page - 1) * limit;
//   const totalProducts = await Product.countDocuments();
//   const sortOrder = order === 'asc' ? 1 : -1;

//   const products = await Product.find()
//     .select(
//       '_id productName productSubtitle productImages productPrice productDate productSale productCategories productQuantity'
//     )
//     .limit(limit)
//     .skip(skip)
//     .sort({ productDate: sortOrder })
//     .populate('productCategories', 'catName')
//     .lean();

//   res.status(200).json({
//     status: httpStatusText.SUCCESS,
//     data: { totalProducts, products },
//   });
// });

const getAllProducts = asyncWrapper(async (req, res, next) => {
  let {
    limit = 16,
    page = 1,
    categories = '',
    order = 'desc',
    sortBy = 'date',
  } = req.query;

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
  const sortOrder = order === 'asc' ? 1 : -1;

  // Define valid sort fields
  const sortFields = {
    name: 'productName',
    date: 'productDate',
    price: 'effectivePrice', // Use calculated field for sorting by price
  };

  const sortField = sortFields[sortBy] || 'productDate'; // Default to sorting by date

  let categoryFilter = {};
  if (categories && categories.trim() !== '') {
    const categoryIds = categories.split(',').map((id) => id.trim());
    console.log(categoryIds);

    if (!categoryIds.every((id) => mongoose.isValidObjectId(id))) {
      return next(
        new AppError('Invalid Category ID format.', 400, httpStatusText.FAIL)
      );
    }

    categoryFilter = {
      productCategories: { $elemMatch: { $in: categoryIds } },
    };
  }

  console.log('Category Filter:', JSON.stringify(categoryFilter, null, 2));

  const totalProducts = await Product.countDocuments(categoryFilter);

  const products = await Product.aggregate([
    { $match: categoryFilter }, // Apply category filter only if categories is provided

    // Calculate effective price (discounted price)
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ['$productSale', 0] }, // If sale exists
            then: {
              $multiply: [
                '$productPrice',
                { $subtract: [1, { $divide: ['$productSale', 100] }] },
              ],
            },
            else: '$productPrice', // Otherwise, use original price
          },
        },
      },
    },

    // Sorting dynamically
    { $sort: { [sortField]: sortOrder } },

    // Pagination
    { $skip: skip },
    { $limit: limit },

    // Select required fields
    {
      $project: {
        _id: 1,
        productName: 1,
        productSubtitle: 1,
        productImages: 1,
        productPrice: 1,
        productDate: 1,
        productSale: 1,
        productQuantity: 1,
        effectivePrice: 1,
      },
    },

    // Populate categories
    {
      $lookup: {
        from: 'categories',
        localField: 'productCategories',
        foreignField: '_id',
        as: 'productCategories',
      },
    },

    {
      $project: {
        _id: 1,
        productName: 1,
        productSubtitle: 1,
        productImages: 1,
        productPrice: 1,
        productDate: 1,
        productSale: 1,
        productQuantity: 1,
        effectivePrice: 1,
        productCategories: {
          $map: {
            input: '$productCategories',
            as: 'category',
            in: {
              _id: '$$category._id',
              catName: '$$category.catName',
            },
          },
        },
      },
    },
  ]);

  console.log(JSON.stringify(products, null, 2));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { totalProducts, products },
  });
});

const getProductById = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id) {
    return next(
      new AppError('Product ID is required', 400, httpStatusText.FAIL)
    );
  }
  if (!mongoose.isValidObjectId(product_id)) {
    return next(
      new AppError('Invalid Product ID format', 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select(
      '_id productName productSubtitle productImages productPrice productQuantity productDate productSale productCategories productDescription colors sizes brand'
    )
    .populate('productCategories', 'catName')
    .lean();

  if (!product) {
    return next(new AppError('Product not found', 404, httpStatusText.FAIL));
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      product,
    },
  });
});

const getMinEffectivePrice = asyncWrapper(async (req, res, next) => {
  const minPrice = await Product.aggregate([
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ['$productSale', 0] }, // If there's a discount
            then: {
              $multiply: [
                '$productPrice',
                { $subtract: [1, { $divide: ['$productSale', 100] }] },
              ],
            },
            else: '$productPrice', // Otherwise, use original price
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        minEffectivePrice: { $min: '$effectivePrice' },
      },
    },
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      minEffectivePrice: minPrice.length ? minPrice[0].minEffectivePrice : 0,
    },
  });
});

const getMaxEffectivePrice = asyncWrapper(async (req, res, next) => {
  const maxPrice = await Product.aggregate([
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ['$productSale', 0] }, // If there's a discount
            then: {
              $multiply: [
                '$productPrice',
                { $subtract: [1, { $divide: ['$productSale', 100] }] },
              ],
            },
            else: '$productPrice', // Otherwise, use original price
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        maxEffectivePrice: { $max: '$effectivePrice' },
      },
    },
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      maxEffectivePrice: maxPrice.length ? maxPrice[0].maxEffectivePrice : 0,
    },
  });
});


const getProductForComparison = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id) {
    return next(
      new AppError('Product ID is required', 400, httpStatusText.FAIL)
    );
  }

  if (!mongoose.isValidObjectId(product_id)) {
    return next(
      new AppError('Invalid Product ID format', 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select(
      '_id productName productSubtitle productImages productPrice productQuantity productDate productSale productCategories productDescription colors sizes brand additionalInformation'
    )
    .populate('productCategories', 'catName')
    .lean();

  if (!product) {
    return next(new AppError('Product not found', 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      product,
    },
  });
});

// const getAllProductNamesAndIds = asyncWrapper(async (req, res, next) => {
//   const products = await Product.find()
//     .select({ _id: 1, productName: 1 })
//     .lean();
//   res.status(200).json({
//     status: httpStatusText.SUCCESS,
//     data: {
//       products,
//     },
//   });
// });

const getSearchProducts = asyncWrapper(async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(
      new AppError('Please enter a search keyword!', 400, httpStatusText.FAIL)
    );
  }

  const categoryIds = await getCategoryIds(query);

  const products = await Product.find({
    $or: [
      { productName: { $regex: query, $options: 'i' } },
      { productCategories: { $in: categoryIds } },
    ],
  })
    .populate('productCategories', 'catName')
    .lean();

  if (!products.length) {
    return next(new AppError('No products found.', 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: products,
  });
});

async function getCategoryIds(query) {
  const categories = await require('../models/category.model')
    .find({ catName: { $regex: query, $options: 'i' } })
    .select('_id')
    .lean();
  return categories.map((cat) => cat._id);
}

module.exports = {
  getAllProducts,
  getProductById,
  getMinEffectivePrice,
  getMaxEffectivePrice,
  getProductForComparison,
  getSearchProducts,
};
