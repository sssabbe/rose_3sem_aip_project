var express = require('express');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Магазин цветов "Роза" - Главная'
    });
});

/* GET розы */
router.get('/roses', function(req, res, next) {
    res.render('roses', {
        title: 'Розы - Магазин цветов "Роза"'
    });
});

/* GET необычные цветы */
router.get('/unusual', function(req, res, next) {
    res.render('unusual', {
        title: 'Необычные цветы - Магазин цветов "Роза"'
    });
});

/* GET свадебные цветы */
router.get('/wedding', function(req, res, next) {
    res.render('wedding', {
        title: 'Свадебные цветы - Магазин цветов "Роза"'
    });
});

/* GET отдельный цветок */
router.get('/flower/:name', function(req, res, next) {
    const flowerName = req.params.name;
    
    const flowers = {
        'rose': {
            title: 'Красная роза - Магазин цветов "Роза"',
            picture: '/images/2025-11-11%2022.23.35.jpg',
            desc: 'Красная роза — символ страстной любви и романтики. Каждый лепесток источает нежность и элегантность, делая этот цветок идеальным выбором для особых моментов. Наши розы выращиваются с особой заботой и вниманием к деталям.'
        },
        'exotic': {
            title: 'Экзотический цветок - Магазин цветов "Роза"',
            picture: '/images/2025-11-11%2022.23.43.jpg', 
            desc: 'Уникальные экзотические цветы, привезенные из самых отдаленных уголков мира. Их необычная форма и яркие цвета создают неповторимую атмосферу волшебства. Каждый цветок — это настоящее произведение искусства природы.'
        },
        'wedding': {
            title: 'Свадебная композиция - Магазин цветов "Роза"',
            picture: '/images/2025-11-11%2022.23.47.jpg',
            desc: 'Изысканная свадебная композиция, созданная специально для самого важного дня в вашей жизни. Нежные оттенки и гармоничное сочетание цветов подчеркнут красоту момента и создадут атмосферу настоящей сказки.'
        }
    };
    
    const flower = flowers[flowerName] || {
        title: 'Цветок - Магазин цветов "Роза"',
        picture: '/images/default.jpg',
        desc: 'Прекрасный цветок из нашей коллекции.'
    };
    
    res.render('rose', flower);
});

module.exports = router;