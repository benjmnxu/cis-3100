const db = require('../db');

// POST /api/search-history
exports.addSearchEntry = async (req, res) => {
  const { query, results_count } = req.body;

  if (!query || typeof results_count !== 'number') {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }

  try {
    const [entry] = await db('search_history')
      .insert({
        user_id: req.user.id,
        query,
        results_count
      })
      .returning('*');

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving search entry' });
  }
};

// GET /api/search-history
exports.getSearchHistory = async (req, res) => {
  try {
    const history = await db('search_history')
      .where({ user_id: req.user.id })
      .orderBy('search_date', 'desc');

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching search history' });
  }
};
