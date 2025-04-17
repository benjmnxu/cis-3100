const db = require('../db');

// GET /api/user/:id
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Check that user is requesting their own profile
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch user from DB
    const user = await db('users')
      .select('id', 'email', 'created_at')
      .where({ id })
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'email', 'created_at')
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching current user info' });
  }
};
