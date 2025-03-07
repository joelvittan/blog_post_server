const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// POST /api/users/signup - Register a new user
router.post('/signup', userController.signup);

// POST /api/users/login - Login a user
router.post('/login', userController.login);

// GET /api/users/profile - Get user profile (requires authentication)
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;

