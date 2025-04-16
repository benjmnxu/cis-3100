const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// POST /api/auth/register
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user into DB
    const [user] = await db('users')
      .insert({ email, password_hash })
      .returning(['id', 'email']);

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    // Sign JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    // Send JWT as HTTP-only cookie
    res
      .cookie('token', token, { httpOnly: true })
      .json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
