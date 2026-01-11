// models/order.js
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var orderSchema = new Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: String,
    customerEmail: String,
    flowers: [{
        flowerId: Schema.Types.ObjectId,
        title: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'processing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: String,
    deliveryDate: Date,
    notes: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
})

// Метод для расчета общей суммы
orderSchema.methods.calculateTotal = function() {
    this.totalAmount = this.flowers.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    return this.totalAmount;
}

// Метод для получения статуса заказа
orderSchema.methods.getStatusText = function() {
    const statuses = {
        'pending': 'Ожидает обработки',
        'processing': 'В обработке',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
    return statuses[this.status] || 'Неизвестно';
}

module.exports.Order = mongoose.model("Order", orderSchema)