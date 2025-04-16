const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// POST or update a review
router.post('/', authMiddleware, reviewController.upsertReview);

// Get all reviews for a recipe
router.get('/recipe/:id', reviewController.getReviewsByRecipe);

// Delete own review for a recipe
router.delete('/:recipe_id', authMiddleware, reviewController.deleteReview);

module.exports = router;
