var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Цветочный магазин</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
                h1 { color: #e91e63; }
                .nav { margin: 20px 0; }
                .nav a { display: inline-block; margin: 10px; padding: 15px 25px; 
                         background: #e91e63; color: white; text-decoration: none; 
                         border-radius: 5px; }
                .nav a:hover { background: #c2185b; }
            </style>
        </head>
        <body>
            <h1>🌸 Добро пожаловать в цветочный магазин "Flowers by Sabi"! 🌸</h1>
            <p>Выберите категорию цветов:</p>
            <div class="nav">
                <a href="/roses">Розы</a>
                <a href="/unusual">Необычные цветы</a>
                <a href="/wedding">Свадебные цветы</a>
            </div>
        </body>
        </html>
    `);
});

/* GET розы */
router.get('/roses', function(req, res, next) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Розы - Цветочный магазин</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background-color: #fff5f5; }
                h1 { color: #e91e63; }
                .flower-list { list-style-type: none; padding: 0; }
                .flower-list li { padding: 10px; margin: 5px; background: white; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>🌹 Розы</h1>
            <p>Широкий ассортимент роз для любого случая</p>
            <ul class="flower-list">
                <li>Красные розы - от 100 руб/шт</li>
                <li>Белые розы - от 120 руб/шт</li>
                <li>Розовые розы - от 110 руб/шт</li>
                <li>Чайные розы - от 150 руб/шт</li>
            </ul>
            <a href="/">← На главную</a>
        </body>
        </html>
    `);
});

/* GET необычные цветы */
router.get('/unusual', function(req, res, next) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Необычные цветы - Цветочный магазин</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background-color: #f0fff0; }
                h1 { color: #4caf50; }
                .flower-list { list-style-type: none; padding: 0; }
                .flower-list li { padding: 10px; margin: 5px; background: white; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>🌺 Необычные цветы</h1>
            <p>Экзотические и редкие сорта цветов</p>
            <ul class="flower-list">
                <li>Орхидеи - от 500 руб</li>
                <li>Стрелиции - от 450 руб</li>
                <li>Протеи - от 600 руб</li>
                <li>Антуриумы - от 400 руб</li>
                <li>Герберы - от 200 руб</li>
            </ul>
            <a href="/">← На главную</a>
        </body>
        </html>
    `);
});

/* GET свадебные цветы */
router.get('/wedding', function(req, res, next) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Свадебные цветы - Цветочный магазин</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background-color: #f0f8ff; }
                h1 { color: #2196f3; }
                .flower-list { list-style-type: none; padding: 0; }
                .flower-list li { padding: 10px; margin: 5px; background: white; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>💐 Свадебные цветы</h1>
            <p>Цветы для самого особенного дня в вашей жизни</p>
            <ul class="flower-list">
                <li>Свадебные букеты невесты - от 3000 руб</li>
                <li>Бутоньерки для жениха - от 500 руб</li>
                <li>Цветочные арки - от 5000 руб</li>
                <li>Букеты для подружек невесты - от 1500 руб</li>
                <li>Свадебные композиции - от 2000 руб</li>
            </ul>
            <a href="/">← На главную</a>
        </body>
        </html>
    `);
});

module.exports = router;