const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes require authentication
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/:orderId/status', protect, getPaymentStatus);

module.exports = router;
