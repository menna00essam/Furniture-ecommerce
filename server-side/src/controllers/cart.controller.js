const mongoose = require('mongoose');
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const Cart = require('../models/cart.model');
const asyncWrapper = require('../middlewares/asyncWrapper.middleware');

// GET: Retrieve user cart
const getUserCart = asyncWrapper(async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId })
      .populate(
        'products.productId',
        '_id productName productImages productPrice'
      )
      .exec();

    if (!cart) {
      return next(new AppError('Cart not found.', 404, httpStatusText.FAIL));
    }

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: {
        products: cart.products.map((p) => ({
          product_id: p.productId._id,
          quantity: p.quantity,
          productName: p.productId.productName,
          productImage: p.productId.productImages[0],
          productPrice: p.productId.productPrice,
          subtotal: p.quantity * p.productId.productPrice,
        })),
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST: Add products to cart
const addToCart = asyncWrapper(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = req.body; // [{ productId, quantity }]

    if (!Array.isArray(items) || items.length === 0) {
      return next(
        new AppError('Invalid cart items.', 400, httpStatusText.FAIL)
      );
    }

    for (const item of items) {
      if (
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        item.quantity < 1
      ) {
        return next(
          new AppError(
            'Invalid productId or quantity.',
            400,
            httpStatusText.FAIL
          )
        );
      }
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    items.forEach(({ productId, quantity }) => {
      const existingProduct = cart.products.find(
        (p) => p.productId.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    });

    await cart.save();
    await cart.populate(
      'products.productId',
      '_id productName productImages productPrice'
    );

    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH: Update cart (change quantity or remove a product)
const updateCart = asyncWrapper(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 0) {
      return next(
        new AppError('Invalid productId or quantity.', 400, httpStatusText.FAIL)
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(new AppError('Cart not found.', 404, httpStatusText.FAIL));
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return next(
        new AppError('Product not found in cart.', 404, httpStatusText.FAIL)
      );
    }

    if (quantity > 0) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();
    await cart.populate(
      'products.productId',
      '_id productName productImages productPrice'
    );

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: { cart },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getUserCart,
  addToCart,
  updateCart,
};
