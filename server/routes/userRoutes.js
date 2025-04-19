const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { required } = require('../middleware/authMiddleware');

// Protected route: GET /api/user/:id
router.get('/me', required, userController.getCurrentUser);
router.get('/:id', required, userController.getUserProfile);

module.exports = router;
