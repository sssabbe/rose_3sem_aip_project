const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['bouquet', 'flower', 'accessory'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    image: String
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product };