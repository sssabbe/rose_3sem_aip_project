// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['bouquet', 'flower', 'accessory'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: String,
  image: String,
  inStock: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);