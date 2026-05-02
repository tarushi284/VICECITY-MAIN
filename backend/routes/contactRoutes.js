const express = require('express');
const router = express.Router();
const { getContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getContacts).post(protect, admin, createContact);
router.route('/:id').put(protect, admin, updateContact).delete(protect, admin, deleteContact);

module.exports = router;
