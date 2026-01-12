module.exports = function(req, res, next) {
    // Инициализируем корзину, если её нет
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            total: 0,
            itemCount: 0,
            lastUpdated: new Date().toLocaleString('ru-RU'),
            discount: 0,
            deliveryCost: 0
        };
    }
    
    // Вычисляем общее количество товаров и сумму
    function updateCartTotals(cart) {
        cart.itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.lastUpdated = new Date().toLocaleString('ru-RU');
        
        // Если сумма больше 5000 - скидка 10%
        if (cart.total > 5000) {
            cart.discount = Math.round(cart.total * 0.1);
            cart.totalWithDiscount = cart.total - cart.discount;
        } else {
            cart.discount = 0;
            cart.totalWithDiscount = cart.total;
        }
        
        // Стоимость доставки (бесплатно от 2000 руб)
        cart.deliveryCost = cart.totalWithDiscount >= 2000 ? 0 : 300;
        cart.finalTotal = cart.totalWithDiscount + cart.deliveryCost;
    }
    
    // Обновляем итоги корзины
    updateCartTotals(req.session.cart);
    
    // Добавляем функции для работы с корзиной в res.locals
    res.locals.cart = {
        // Данные корзины
        items: req.session.cart.items,
        itemCount: req.session.cart.itemCount,
        total: req.session.cart.total,
        discount: req.session.cart.discount,
        totalWithDiscount: req.session.cart.totalWithDiscount,
        deliveryCost: req.session.cart.deliveryCost,
        finalTotal: req.session.cart.finalTotal,
        lastUpdated: req.session.cart.lastUpdated,
        
        // Вспомогательные функции для шаблонов
        isEmpty: function() {
            return this.items.length === 0;
        },
        
        hasDiscount: function() {
            return this.discount > 0;
        },
        
        freeDelivery: function() {
            return this.deliveryCost === 0;
        },
        
        // Форматирование цены
        formatPrice: function(price) {
            return new Intl.NumberFormat('ru-RU').format(price) + ' руб.';
        },
        
        // Поиск товара в корзине
        findItem: function(productId) {
            return this.items.find(item => item.id === productId);
        }
    };
    
    // Также добавляем более короткие алиасы для удобства
    res.locals.cartItems = req.session.cart.items;
    res.locals.cartItemCount = req.session.cart.itemCount;
    res.locals.cartTotal = req.session.cart.finalTotal;
    
    // Функции для работы с корзиной (можно вызывать в шаблонах)
    res.locals.getCartItemQuantity = function(productId) {
        const item = req.session.cart.items.find(i => i.id === productId);
        return item ? item.quantity : 0;
    };
    
    res.locals.isInCart = function(productId) {
        return req.session.cart.items.some(item => item.id === productId);
    };
    
    next();
};