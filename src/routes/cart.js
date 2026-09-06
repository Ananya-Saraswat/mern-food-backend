const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Food = require('../models/Food');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(protect);

router.get('/', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.food');
  const grouped = new Map();
  user.cart.filter((item) => item.food && item.food.isAvailable).forEach((item) => {
    const key = item.food.id;
    const existing = grouped.get(key);
    if (existing) existing.quantity = Math.max(existing.quantity, item.quantity);
    else grouped.set(key, { food: item.food, quantity: item.quantity });
  });
  const items = [...grouped.values()];
  const total = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  res.json({ success: true, items, total: Number(total.toFixed(2)) });
}));

router.post('/', [
  body('foodId').isMongoId().withMessage('A valid foodId is required'),
  body('quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
  validate
], asyncHandler(async (req, res) => {
  const food = await Food.findOne({ _id: req.body.foodId, isAvailable: true });
  if (!food) {
    const error = new Error('Food item not found or unavailable');
    error.statusCode = 404;
    throw error;
  }
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter((item) => item.food.toString() !== food.id);
  user.cart.push({ food: food.id, quantity: req.body.quantity });
  await user.save();
  res.json({ success: true, message: 'Cart updated' });
}));

router.delete('/:foodId', asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $pull: { cart: { food: req.params.foodId } } });
  res.json({ success: true, message: 'Item removed from cart' });
}));

router.delete('/', asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });
  res.json({ success: true, message: 'Cart cleared' });
}));

module.exports = router;
