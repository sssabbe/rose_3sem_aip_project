// routes/categories.js
var express = require('express');
var router = express.Router();
// ПОДКЛЮЧАЕМ МОДЕЛЬ (как в примере с cats.js)
var Product = require('../models/Product').Product;

/* GET categories listing. */
router.get('/', function(req, res, next) {
    res.send('Новый маршрутизатор, для маршрутов, начинающихся с /categories');
});

/* Страница букетов */
router.get('/bouquets', async function(req, res, next) {
    try {
        // Находим все букеты в базе данных
        var bouquets = await Product.find({ category: 'bouquet' });
        console.log('Найдено букетов:', bouquets.length);
        
        res.render('categories/bouquets', {
            title: 'Букеты - Магазин цветов "Роза"',
            products: bouquets
        });
    } catch (err) {
        next(err);
    }
});

/* Страница цветов */
router.get('/flowers', async function(req, res, next) {
    try {
        var flowers = await Product.find({ category: 'flower' });
        console.log('Найдено цветов:', flowers.length);
        
        res.render('categories/flowers', {
            title: 'Цветы - Магазин цветов "Роза"',
            products: flowers
        });
    } catch (err) {
        next(err);
    }
});

/* Страница аксессуаров */
router.get('/accessories', async function(req, res, next) {
    try {
        var accessories = await Product.find({ category: 'accessory' });
        console.log('Найдено аксессуаров:', accessories.length);
        
        res.render('categories/accessories', {
            title: 'Аксессуары - Магазин цветов "Роза"',
            products: accessories
        });
    } catch (err) {
        next(err);
    }
});

/* Страница отдельного товара (аналог /:nick из примера) */
router.get('/:category/:id', async function(req, res, next) {
    try {
        var product = await Product.findById(req.params.id);
        console.log('Найден товар:', product);
        
        if (!product) {
            return next(new Error("Такого товара нет в магазине"));
        }
        
        res.render('categories/product-detail', {
            title: product.name + ' - Магазин цветов "Роза"',
            product: product
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;