var express = require('express');
var router = express.Router();
var checkAuth = require("../middlewares/checkAuth.js");

// Все роуты в этом файле требуют авторизации
router.use(checkAuth);

// Личный кабинет пользователя
router.get('/profile', function(req, res, next) {
    res.render('auth/profile', {
        title: 'Личный кабинет',
        user: req.session.user
    });
});

// Страница оформления заказа
router.get('/checkout', function(req, res, next) {
    // Проверяем, есть ли товары в корзине
    if (!req.session.cart || req.session.cart.items.length === 0) {
        req.flash('error', 'Ваша корзина пуста');
        return res.redirect('/cart');
    }
    
    res.render('checkout', {
        title: 'Оформление заказа',
        user: req.session.user,
        cart: req.session.cart
    });
});

// История заказов
router.get('/orders', function(req, res, next) {
    // Здесь должна быть логика получения заказов из БД
    const orders = []; // Заглушка
    
    res.render('orders', {
        title: 'Мои заказы',
        user: req.session.user,
        orders: orders
    });
});

// Страница настроек профиля
router.get('/settings', function(req, res, next) {
    res.render('auth/settings', {
        title: 'Настройки профиля',
        user: req.session.user
    });
});

// Обработка заказа (POST)
router.post('/place-order', function(req, res, next) {
    // Логика оформления заказа
    console.log('📦 Оформление заказа для пользователя:', req.session.username);
    
    // Очищаем корзину после оформления
    delete req.session.cart;
    
    req.flash('success', 'Заказ успешно оформлен!');
    res.redirect('/orders');
});

module.exports = router;