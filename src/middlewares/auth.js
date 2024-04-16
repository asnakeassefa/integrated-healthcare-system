const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  console.log('auth middleware')
  const bearer = req.headers.authorization;

  // Check for missing Authorization header
  if (!bearer) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const tokenParts = bearer.split(' ');

  // Check for invalid token format (Bearer <token>)
  if (tokenParts.length !== 2 || !tokenParts[0] || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const token = tokenParts[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (!req.user || req.user.Role.name !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  } catch (err) {
    // Handle specific JWT verification errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else {
      // Handle other errors (e.g., secret key issue)
      console.error('JWT verification error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = auth;
