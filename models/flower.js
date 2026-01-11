// models/flower.js
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var flowerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        unique: true,
        required: true
    },
    avatar: String,
    desc: String,
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        enum: ['roses', 'wedding', 'unusual', 'field', 'bouquets'],
        default: 'roses'
    },
    inStock: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
})

// Добавим метод для цветка
flowerSchema.methods.getFormattedPrice = function() {
    return this.price + ' ₽';
}

flowerSchema.methods.showInfo = function() {
    console.log('🌸 ' + this.title + ' (' + this.nick + ')');
    console.log('   Цена: ' + this.getFormattedPrice());
    console.log('   Категория: ' + this.category);
    console.log('   В наличии: ' + (this.inStock ? 'Да' : 'Нет'));
}

module.exports.Flower = mongoose.model("Flower", flowerSchema)