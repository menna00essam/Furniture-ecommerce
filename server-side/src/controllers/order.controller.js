const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Order = require("../models/order.model");

const getOrders = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  console.log("User ID:", userId); // Debugging

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ userId })
    .select("orderNumber status totalAmount createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  console.log(orders);
  const totalOrders = await Order.countDocuments({ userId });

  if (orders.length === 0) {
    return next(
      new AppError("No orders found for this user", 404, httpStatusText.FAIL)
    );
  }

  const formattedOrders = orders.map((order) => ({
    orderNumber: order._id,
    status: order.status,
    total: `${order.totalAmount.toFixed(2)}`,
    createdAt: order.createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { orders: formattedOrders, totalOrders },
  });
});

module.exports = { getOrders };
