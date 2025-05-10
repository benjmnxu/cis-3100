const express = require('express');
const router = express.Router();

const recipeController = require('../controllers/recipeController');
const { required, optional } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

// Public routes
router.get('/', recipeController.getAllRecipes)
router.get('/user/:userId', recipeController.getRecipesByUser);

// Optional - different behavior based on authentication status
router.get('/:id', optional, recipeController.getRecipeById);

// Protected route – must be logged in to create
router.post('/', required, recipeController.createRecipe);
router.put('/:id', required, recipeController.updateRecipe);
router.delete('/:id', required, recipeController.deleteRecipe);


module.exports = router;
