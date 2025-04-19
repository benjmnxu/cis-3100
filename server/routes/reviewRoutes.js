const express = require('express');
const router = express.Router();
const { required } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// POST or update a review
router.post('/', required, reviewController.upsertReview);

// Get all reviews for a recipe
router.get('/recipe/:id', reviewController.getReviewsByRecipe);

// Delete own review for a recipe
router.delete('/:recipe_id', required, reviewController.deleteReview);

module.exports = router;
