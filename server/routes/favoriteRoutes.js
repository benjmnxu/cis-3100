const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

// 🔒 Protected Routes
router.post('/', authMiddleware, favoriteController.addFavorite);             // Add favorite
router.delete('/:recipe_id', authMiddleware, favoriteController.removeFavorite); // Remove favorite
router.get('/', authMiddleware, favoriteController.getFavorites);             // Get all favorites

module.exports = router;
