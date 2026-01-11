// routes/flowers.js (упрощенная, без БД)
var express = require('express');
var router = express.Router();

/* GET flowers listing. */
router.get('/', function(req, res, next) {
    res.render('categories/flowers', {
        title: 'Цветы - Магазин цветов "Роза"',
        pageTitle: 'Срезанные цветы',
        products: [
            {
                name: 'Красная роза',
                price: 300,
                description: 'Классическая красная роза'
            },
            {
                name: 'Белая лилия',
                price: 250,
                description: 'Элегантная белая лилия'
            },
            {
                name: 'Розовый тюльпан',
                price: 200,
                description: 'Нежный розовый тюльпан'
            }
        ]
    });
});

module.exports = router;