const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Order = require("../models/order.model");
const getOrders = asyncWrapper(async (req, res, next) => {
  const userId = req.user.id;

  // Pagination parameters
  const page = parseInt(req.query.page) || 1; // Current page (default: 1)
  const limit = parseInt(req.query.limit) || 10; // Orders per page (default: 10)
  const skip = (page - 1) * limit; // Number of orders to skip

  const orders = await Order.find({ userId })
    .select(" status totalAmount createdAt") // Select only the required fields
    .sort({ createdAt: -1 }) // Sort by creation date (newest first)
    .skip(skip)
    .limit(limit);

  // Count total number of orders for the user
    const totalOrders = await Order.countDocuments({ userId });
    
  if (!orders || orders.length === 0) {
    return next(
      new AppError("No orders found for this user", 404, httpStatusText.FAIL)
    );
  }

  // Format the response
  const formattedOrders = orders.map((order) => ({
    orderNumber: order.orderNumber, // Use the order's orderNumber
    status: order.status,
    total: `${order.totalAmount.toFixed(2)}`, // Format total amount as a string with 2 decimal places
    createdAt: order.createdAt.toLocaleDateString("en-US", {
      // Format date as "MMM D, YYYY"
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      orders: formattedOrders,
      totalOrders: totalOrders,
    },
  });
});

module.exports = {
  getOrders,
};
