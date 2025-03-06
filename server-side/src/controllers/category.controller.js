const Category = require("../models/category.model");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const asyncWrapper = require("../middlewares/asyncWrapper.middleware");


const getAllCategories = asyncWrapper(async (req, res, next) => {
  try {
    const categories = await Category.find({}, { __v: false }); 
    // console.log("categories>>>>>>>>>>>>>>",categories)
    if (!categories.length) {
      return next(new AppError("No categories found.", 404, httpStatusText.FAIL));
    }

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAllCategories,
};
