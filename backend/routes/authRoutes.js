const express = require('express');
const router = express.Router();
const { authUser, registerUser, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
