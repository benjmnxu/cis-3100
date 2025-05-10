const db = require('../db');

// ✅ Get all recipes with optional filters
exports.getAllRecipes = async (req, res) => {
  const { cuisine, difficulty, search } = req.query;

  try {
    let query = db('recipes').select(
      'id',
      'title',
      'description',
      'cuisine_type',
      'difficulty_level'
    );

    if (cuisine) {
      query.whereILike('cuisine_type', `%${cuisine}%`);
    }

    if (difficulty) {
      query.whereILike('difficulty_level', `%${difficulty}%`);
    }

    if (search) {
      query.whereILike('title', `%${search}%`);
    }

    const recipes = await query;

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error filtering recipes' });
  }
};

// ✅ Get one recipe by ID
exports.getRecipeById = async (req, res) => {
  const { id }   = req.params;
  const userId   = req.user?.id;

  try {
    const recipe = await db('recipes')
      .where({ id })
      .first();

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    let isFavorited = false;
    if (userId) {
      const fav = await db('favorite_recipes')
        .where({ user_id: userId, recipe_id: id })
        .first();
      isFavorited = !!fav;
    }

    recipe.is_favorited = isFavorited;
    return res.json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching recipe' });
  }
};


// ✅ Create recipe (no image logic)
exports.createRecipe = async (req, res) => {
  const {
    title,
    description,
    ingredients,
    instructions,
    prep_time,
    cook_time,
    cuisine_type,
    difficulty_level
  } = req.body;

  try {
    const [recipe] = await db('recipes')
      .insert({
        user_id: req.user.id,
        title,
        description,
        ingredients: db.raw('ARRAY[?]::text[]', [ingredients]),
        instructions,
        prep_time: parseInt(prep_time),
        cook_time: parseInt(cook_time),
        cuisine_type,
        difficulty_level
      })
      .returning('*');

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating recipe' });
  }
};

// ✅ Update recipe
exports.updateRecipe = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    ingredients,
    instructions,
    prep_time,
    cook_time,
    cuisine_type,
    difficulty_level
  } = req.body;

  try {
    const updated = await db('recipes')
      .where({ id, user_id: req.user.id })
      .update({
        title,
        description,
        ingredients: db.raw('ARRAY[?]::text[]', [ingredients]),
        instructions,
        prep_time: parseInt(prep_time),
        cook_time: parseInt(cook_time),
        cuisine_type,
        difficulty_level
      })
      .returning('*');

    if (!updated.length) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating recipe' });
  }
};

// ✅ Delete recipe
exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db('recipes')
      .where({ id, user_id: req.user.id })
      .del();

    if (!deleted) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
};

exports.getRecipesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const recipes = await db('recipes')
      .where({ user_id: userId })
      .select('id', 'title', 'description', 'cuisine_type', 'difficulty_level', 'created_at');

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user recipes' });
  }
};
