const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const orderController = require('../controllers/order.controller');

router.route('/').get(verifyToken, orderController.getOrders); // GET All Orders
module.exports = router;
