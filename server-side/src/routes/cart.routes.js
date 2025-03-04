const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.route('/').get(cartController.getUserCart); // GET User Cart

router
  .route('/')
  .post(cartController.addToCart) // Add Items
  .patch(cartController.updateCart); // Update Items or Delete

module.exports = router;
