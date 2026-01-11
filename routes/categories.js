// routes/categories.js
var express = require('express');
var router = express.Router();

/* GET categories listing. */
router.get('/', function(req, res, next) {
    // Инициализируем корзину если ее нет
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    res.render('categories/index', {
        title: 'Категории - Магазин цветов "Роза"',
        cartCount: req.session.cart.length,
        categories: [
            {
                name: 'Букеты',
                url: '/categories/bouquets',
                icon: 'fas fa-bouquet',
                description: 'Готовые композиции из свежих цветов',
                count: 12
            },
            {
                name: 'Цветы',
                url: '/categories/flowers',
                icon: 'fas fa-flower',
                description: 'Отдельные цветы для составления букетов',
                count: 24
            },
            {
                name: 'Аксессуары',
                url: '/categories/accessories',
                icon: 'fas fa-ribbon',
                description: 'Вазы, ленты, открытки и упаковка',
                count: 18
            }
        ]
    });
});

/* GET /categories/bouquets */
router.get('/bouquets', function(req, res, next) {
    // Тестовые данные для букетов
    const bouquets = [
        {
            id: 1,
            name: 'Романтический букет',
            price: 2500,
            description: 'Красные розы и белые лилии'
        },
        {
            id: 2,
            name: 'Весенний букет',
            price: 1800,
            description: 'Тюльпаны и гипсофилы'
        },
        {
            id: 3,
            name: 'Свадебный букет',
            price: 3500,
            description: 'Белые розы и орхидеи'
        }
    ];
    
    res.render('categories/bouquets', {
        title: 'Букеты - Магазин цветов "Роза"',
        pageTitle: 'Наши букеты',
        products: bouquets
    });
});

/* GET /categories/flowers */
router.get('/flowers', function(req, res, next) {
    // Тестовые данные для цветов
    const flowers = [
        {
            id: 1,
            name: 'Красная роза',
            price: 300,
            description: 'Классическая красная роза'
        },
        {
            id: 2,
            name: 'Белая лилия',
            price: 250,
            description: 'Элегантная белая лилия'
        },
        {
            id: 3,
            name: 'Розовый тюльпан',
            price: 200,
            description: 'Нежный розовый тюльпан'
        }
    ];
    
    res.render('categories/flowers', {
        title: 'Цветы - Магазин цветов "Роза"',
        pageTitle: 'Срезанные цветы',
        products: flowers
    });
});

/* GET /categories/accessories */
router.get('/accessories', function(req, res, next) {
    // Тестовые данные для аксессуаров
    const accessories = [
        {
            id: 1,
            name: 'Стеклянная ваза',
            price: 1200,
            description: 'Элегантная ваза для цветов'
        },
        {
            id: 2,
            name: 'Шелковая лента',
            price: 150,
            description: 'Лента для украшения букета'
        },
        {
            id: 3,
            name: 'Подарочная открытка',
            price: 100,
            description: 'Открытка с теплыми пожеланиями'
        }
    ];
    
    res.render('categories/accessories', {
        title: 'Аксессуары - Магазин цветов "Роза"',
        pageTitle: 'Аксессуары для цветов',
        products: accessories
    });
});

/* GET корзина покупок */
router.get('/cart', function(req, res, next) {
    // Инициализируем корзину если ее нет
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    // Подсчитываем общую сумму
    const total = req.session.cart.reduce((sum, item) => sum + item.price, 0);
    
    res.render('categories/cart', {
        title: 'Корзина - Магазин цветов "Роза"',
        cart: req.session.cart,
        total: total,
        cartCount: req.session.cart.length
    });
});

/* POST добавить товар в корзину */
router.post('/cart/add', function(req, res, next) {
    const { id, name, price } = req.body;
    
    // Инициализируем корзину если ее нет
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    // Добавляем товар в корзину
    req.session.cart.push({
        id: id || Date.now(),
        name: name || 'Товар',
        price: parseInt(price) || 0,
        addedAt: new Date().toLocaleString('ru-RU')
    });
    
    res.redirect('/categories/cart');
});

/* POST очистить корзину */
router.post('/cart/clear', function(req, res, next) {
    req.session.cart = [];
    res.redirect('/categories/cart');
});

module.exports = router;