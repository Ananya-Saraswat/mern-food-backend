const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  category: { type: String, required: true, trim: true, index: true },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true, index: true }
}, { timestamps: true });

foodSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Food', foodSchema);
