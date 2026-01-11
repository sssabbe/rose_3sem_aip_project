// models/Candy.js
const mongoose = require('mongoose');

const candySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['korzhik', 'karamelka', 'kompot'],
    required: true
  },
  weight: {
    type: Number,
    min: 1,
    max: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Candy', candySchema);