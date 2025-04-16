const db = require('../db');

// ✅ Create or update review
exports.upsertReview = async (req, res) => {
  const { recipe_id, rating, comment } = req.body;

  if (!recipe_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid recipe_id or rating' });
  }

  try {
    const [review] = await db('reviews')
      .insert({
        user_id: req.user.id,
        recipe_id,
        rating,
        comment
      })
      .onConflict(['user_id', 'recipe_id']) // upsert
      .merge({
        rating,
        comment,
        created_at: db.fn.now()
      })
      .returning('*');

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving review' });
  }
};

exports.getReviewsByRecipe = async (req, res) => {
    const { id } = req.params;
  
    try {
      const reviews = await db('reviews')
        .join('users', 'reviews.user_id', 'users.id')
        .where('reviews.recipe_id', id)
        .select(
          'reviews.id',
          'reviews.rating',
          'reviews.comment',
          'reviews.created_at',
          'users.id as user_id',
          'users.email as reviewer_email' // 👈 show who left it
        );
  
      res.json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching reviews' });
    }
  };
  
  

// ✅ Delete own review
exports.deleteReview = async (req, res) => {
  const { recipe_id } = req.params;

  try {
    const deleted = await db('reviews')
      .where({
        user_id: req.user.id,
        recipe_id
      })
      .del();

    if (!deleted) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting review' });
  }
};
