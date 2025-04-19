// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function required(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function optional(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      console.error(err);
      res.status(err.status).json({ message: 'Error' });
    }
  }
  next();
}

module.exports = {
  required,
  optional
};
