const express = require('express');
const router = express.Router();
const { getMyBills, createBill, payBill } = require('../controllers/billController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyBills).post(protect, admin, createBill);
router.route('/:id/pay').put(protect, payBill);

module.exports = router;
