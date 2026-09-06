const express = require('express');
const { query } = require('express-validator');
const Food = require('../models/Food');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', [
  query('category').optional().trim().isLength({ min: 1 }).withMessage('Category cannot be empty'),
  query('search').optional().trim().isLength({ min: 1 }).withMessage('Search cannot be empty'),
  validate
], asyncHandler(async (req, res) => {
  const filter = { isAvailable: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.$text = { $search: req.query.search };
  const foods = await Food.find(filter).sort({ category: 1, name: 1 });
  res.json({ success: true, count: foods.length, foods });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const food = await Food.findOne({ _id: req.params.id, isAvailable: true });
  if (!food) {
    const error = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, food });
}));

module.exports = router;
