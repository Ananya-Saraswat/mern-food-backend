const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    const error = new Error('Authentication required');
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'development-secret');
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) throw new Error('User no longer exists');
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = 'Invalid or expired token';
    throw error;
  }
});

module.exports = protect;
