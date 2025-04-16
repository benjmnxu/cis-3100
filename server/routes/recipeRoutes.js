const express = require('express');
const router = express.Router();

const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

// Public routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected route – must be logged in to create
router.post('/', authMiddleware, recipeController.createRecipe);
router.put('/:id', authMiddleware, recipeController.updateRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);


module.exports = router;
