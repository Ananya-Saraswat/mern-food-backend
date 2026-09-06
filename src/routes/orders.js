const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(protect);

router.post('/', [
  body('deliveryAddress.line1').trim().notEmpty().withMessage('Address line is required'),
  body('deliveryAddress.city').trim().notEmpty().withMessage('City is required'),
  body('deliveryAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  validate
], asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.food');
  const cart = user.cart.filter((item) => item.food && item.food.isAvailable);
  if (!cart.length) {
    const error = new Error('Cannot place an order with an empty cart');
    error.statusCode = 400;
    throw error;
  }
  const items = cart.map((item) => ({ food: item.food.id, name: item.food.name, price: item.food.price, quantity: item.quantity }));
  const total = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const order = await Order.create({ user: user.id, items, total, deliveryAddress: req.body.deliveryAddress });
  user.cart = [];
  await user.save();
  res.status(201).json({ success: true, order });
}));

router.get('/', asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, order });
}));

module.exports = router;
