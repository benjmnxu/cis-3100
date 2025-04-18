const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected route: GET /api/user/:id
router.get('/me', authMiddleware, userController.getCurrentUser);
router.get('/:id', authMiddleware, userController.getUserProfile);



module.exports = router;
