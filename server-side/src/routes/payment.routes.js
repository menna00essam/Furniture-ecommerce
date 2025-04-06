const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/payment',verifyToken, paymentController.createPaymentIntent);
module.exports = router;