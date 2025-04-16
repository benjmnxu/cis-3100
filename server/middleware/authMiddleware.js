const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Read token from cookies
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Missing token' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
