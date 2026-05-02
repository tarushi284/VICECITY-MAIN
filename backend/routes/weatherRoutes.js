const express = require('express');
const router = express.Router();
const { getWeather, updateWeather } = require('../controllers/weatherController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, updateWeather);
router.route('/:city').get(getWeather);

module.exports = router;
