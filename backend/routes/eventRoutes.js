const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent } = require('../controllers/eventController');
const { protect, attractionManager } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(protect, attractionManager, createEvent);
router.route('/:id').get(getEventById).put(protect, attractionManager, updateEvent).delete(protect, attractionManager, deleteEvent);
router.route('/:id/register').post(protect, registerForEvent).delete(protect, unregisterFromEvent);

module.exports = router;
