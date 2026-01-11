// routes/categories.js
var express = require('express');
var router = express.Router();

/* GET categories listing. */
router.get('/', function(req, res, next) {
    res.send('Новый маршрутизатор, для маршрутов, начинающихся с /categories');
});

/* GET /categories/bouquets */
router.get('/bouquets', function(req, res, next) {
    res.send('Категория: Букеты');
});

/* GET /categories/flowers */
router.get('/flowers', function(req, res, next) {
    res.send('Категория: Цветы');
});

/* GET /categories/accessories */
router.get('/accessories', function(req, res, next) {
    res.send('Категория: Аксессуары');
});

module.exports = router;