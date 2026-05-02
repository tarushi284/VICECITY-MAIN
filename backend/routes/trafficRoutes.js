const express = require('express');
const router = express.Router();
const { getTrafficAlerts, createTrafficAlert, resolveTrafficAlert, deleteTrafficAlert } = require('../controllers/trafficController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getTrafficAlerts).post(protect, admin, createTrafficAlert);
router.route('/:id').put(protect, admin, resolveTrafficAlert).delete(protect, admin, deleteTrafficAlert);

module.exports = router;
