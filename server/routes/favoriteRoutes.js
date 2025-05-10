const express = require('express');
const router = express.Router();
const { required } = require('../middleware/authMiddleware');
const favoriteController = require('../controllers/favoriteController');

// 🔒 Protected Routes
router.post('/', required, favoriteController.addFavorite);             // Add favorite
router.delete('/:recipe_id', required, favoriteController.removeFavorite); // Remove favorite
router.get('/', required, favoriteController.getFavorites);             // Get all favorites

module.exports = router;
