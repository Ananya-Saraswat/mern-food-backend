const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const protect = require('../middleware/auth');

const router = express.Router();
const credentials = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

function tokenFor(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'development-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  ...credentials,
  validate
], asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) {
    const error = new Error('An account with that email already exists');
    error.statusCode = 409;
    throw error;
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}));

router.post('/login', [...credentials, validate], asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user) {
    const error = new Error('No account found. Please create an account first.');
    error.statusCode = 404;
    throw error;
  }
  if (!(await user.comparePassword(req.body.password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }
  res.json({ success: true, token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}));

router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
