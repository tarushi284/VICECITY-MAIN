const express = require('express');
const router = express.Router();
const { getAttractions, createAttraction, updateAttraction, deleteAttraction } = require('../controllers/attractionController');
const { protect, attractionManager } = require('../middleware/authMiddleware');

router.route('/').get(getAttractions).post(protect, attractionManager, createAttraction);
router.route('/:id').put(protect, attractionManager, updateAttraction).delete(protect, attractionManager, deleteAttraction);

module.exports = router;
