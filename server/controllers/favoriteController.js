const db = require('../db');

// ✅ Add a favorite
exports.addFavorite = async (req, res) => {
  const { recipe_id } = req.body;

  if (!recipe_id) {
    return res.status(400).json({ message: 'Missing recipe_id' });
  }

  try {
    await db('favorite_recipes').insert({
      user_id: req.user.id,
      recipe_id,
    }).onConflict(['user_id', 'recipe_id']).ignore(); // avoid duplicates

    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding favorite' });
  }
};

// ✅ Remove a favorite
exports.removeFavorite = async (req, res) => {
  const { recipe_id } = req.params;

  try {
    const removed = await db('favorite_recipes')
      .where({ user_id: req.user.id, recipe_id })
      .del();

    if (!removed) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing favorite' });
  }
};

// ✅ Get all favorite recipes for a user
exports.getFavorites = async (req, res) => {
  try {
    const recipes = await db('favorite_recipes')
      .join('recipes', 'favorite_recipes.recipe_id', 'recipes.id')
      .where('favorite_recipes.user_id', req.user.id)
      .select('recipes.*');

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};
