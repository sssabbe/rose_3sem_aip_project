var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Flowers by Sabi - Цветочный магазин</title>
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Source Sans Pro', sans-serif;
                    background: linear-gradient(135deg, #fffaf0 0%, #f8f8ff 50%, #fff0f5 100%);
                    min-height: 100vh;
                    color: #5a5a5a;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 50px;
                    padding: 30px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(10px);
                }
                .main-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: 4rem;
                    color: #e91e63;
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                }
                .subtitle {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    color: #888;
                    font-weight: 300;
                    letter-spacing: 2px;
                }
                .flower-gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 25px;
                    margin: 40px 0;
                }
                .gallery-item {
                    position: relative;
                    overflow: hidden;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    height: 200px;
                }
                .gallery-item:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                }
                .gallery-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .gallery-item:hover img {
                    transform: scale(1.1);
                }
                .nav-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                    margin: 50px 0;
                }
                .nav-card {
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    text-align: center;
                    text-decoration: none;
                    color: inherit;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }
                .nav-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                }
                .nav-icon {
                    font-size: 3rem;
                    margin-bottom: 15px;
                }
                .nav-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    color: #e91e63;
                    margin-bottom: 10px;
                }
                .nav-description {
                    color: #888;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .roses-card { border-top: 4px solid #e91e63; }
                .unusual-card { border-top: 4px solid #4caf50; }
                .wedding-card { border-top: 4px solid #2196f3; }
                .featured-flowers {
                    margin-top: 60px;
                }
                .featured-title {
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    color: #e91e63;
                    margin-bottom: 30px;
                }
                .featured-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }
                .featured-item {
                    text-align: center;
                    text-decoration: none;
                    color: inherit;
                    transition: transform 0.3s ease;
                }
                .featured-item:hover {
                    transform: translateY(-5px);
                }
                .featured-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 15px;
                    margin-bottom: 10px;
                }
                .featured-name {
                    font-weight: 600;
                    color: #e91e63;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 class="main-title">Flowers by Sabi</h1>
                    <p class="subtitle">где нежность встречается с красотой, а любовь говорит цветами</p>
                </div>

                <div class="flower-gallery">
                    <div class="gallery-item">
                        <img src="/images/2025-11-11%2022.23.35.jpg" alt="Нежные цветы">
                    </div>
                    <div class="gallery-item">
                        <img src="/images/2025-11-11%2022.23.43.jpg" alt="Экзотические цветы">
                    </div>
                    <div class="gallery-item">
                        <img src="/images/2025-11-11%2022.23.47.jpg" alt="Свадебные цветы">
                    </div>
                </div>

                <div class="nav-grid">
                    <a href="/roses" class="nav-card roses-card">
                        <div class="nav-icon">🌹</div>
                        <h3 class="nav-title">Розы</h3>
                        <p class="nav-description">Классическая элегантность и нежность в каждом лепестке</p>
                    </a>
                    <a href="/unusual" class="nav-card unusual-card">
                        <div class="nav-icon">🌺</div>
                        <h3 class="nav-title">Необычные цветы</h3>
                        <p class="nav-description">Экзотические сорта, которые удивят даже искушенных ценителей</p>
                    </a>
                    <a href="/wedding" class="nav-card wedding-card">
                        <div class="nav-icon">💐</div>
                        <h3 class="nav-title">Свадебные цветы</h3>
                        <p class="nav-description">Волшебные композиции для самого важного дня в вашей жизни</p>
                    </a>
                </div>

                <div class="featured-flowers">
                    <h2 class="featured-title">Избранные цветы</h2>
                    <div class="featured-grid">
                        <a href="/flower/rose" class="featured-item">
                            <img src="/images/2025-11-11%2022.23.35.jpg" alt="Красная роза" class="featured-image">
                            <div class="featured-name">Красная роза</div>
                        </a>
                        <a href="/flower/exotic" class="featured-item">
                            <img src="/images/2025-11-11%2022.23.43.jpg" alt="Экзотический цветок" class="featured-image">
                            <div class="featured-name">Экзотический цветок</div>
                        </a>
                        <a href="/flower/wedding" class="featured-item">
                            <img src="/images/2025-11-11%2022.23.47.jpg" alt="Свадебная композиция" class="featured-image">
                            <div class="featured-name">Свадебная композиция</div>
                        </a>
                    </div>
                </div>
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
            <title>Розы - Flowers by Sabi</title>
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Source Sans Pro', sans-serif;
                    background: linear-gradient(135deg, #fffaf0 0%, #fff5f5 100%);
                    min-height: 100vh;
                    color: #5a5a5a;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                .page-header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(233, 30, 99, 0.1);
                }
                .page-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: 3.5rem;
                    color: #e91e63;
                    margin-bottom: 10px;
                }
                .page-subtitle {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    color: #888;
                }
                .content-wrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    align-items: start;
                }
                .flower-image {
                    width: 100%;
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                .flower-image:hover {
                    transform: scale(1.02);
                }
                .flower-list {
                    list-style: none;
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                .flower-item {
                    padding: 15px 20px;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #fff5f5 0%, #ffeef2 100%);
                    border-radius: 12px;
                    border-left: 4px solid #e91e63;
                    transition: all 0.3s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .flower-item:hover {
                    transform: translateX(10px);
                    box-shadow: 0 5px 15px rgba(233, 30, 99, 0.2);
                }
                .flower-name {
                    font-weight: 600;
                    color: #e91e63;
                }
                .flower-price {
                    color: #888;
                    font-size: 0.9rem;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    margin-top: 40px;
                    padding: 12px 25px;
                    background: white;
                    color: #e91e63;
                    text-decoration: none;
                    border-radius: 25px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    font-weight: 600;
                }
                .back-link:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Розы</h1>
                    <p class="page-subtitle">Символ любви и нежности</p>
                </div>

                <div class="content-wrapper">
                    <div>
                        <img src="/images/2025-11-11%2022.23.35.jpg" alt="Розы" class="flower-image">
                    </div>
                    <div>
                        <ul class="flower-list">
                            <li class="flower-item">
                                <span class="flower-name">Красные розы</span>
                                <span class="flower-price">от 100 руб/шт</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Белые розы</span>
                                <span class="flower-price">от 120 руб/шт</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Розовые розы</span>
                                <span class="flower-price">от 110 руб/шт</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Чайные розы</span>
                                <span class="flower-price">от 150 руб/шт</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <a href="/" class="back-link">← Вернуться на главную</a>
            </div>
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
            <title>Необычные цветы - Flowers by Sabi</title>
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Source Sans Pro', sans-serif;
                    background: linear-gradient(135deg, #f0fff0 0%, #f8fff8 100%);
                    min-height: 100vh;
                    color: #5a5a5a;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                .page-header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(76, 175, 80, 0.1);
                }
                .page-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: 3.5rem;
                    color: #4caf50;
                    margin-bottom: 10px;
                }
                .page-subtitle {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    color: #888;
                }
                .content-wrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    align-items: start;
                }
                .flower-image {
                    width: 100%;
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                .flower-image:hover {
                    transform: scale(1.02);
                }
                .flower-list {
                    list-style: none;
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                .flower-item {
                    padding: 15px 20px;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #f0fff0 0%, #e8f5e8 100%);
                    border-radius: 12px;
                    border-left: 4px solid #4caf50;
                    transition: all 0.3s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .flower-item:hover {
                    transform: translateX(10px);
                    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.2);
                }
                .flower-name {
                    font-weight: 600;
                    color: #4caf50;
                }
                .flower-price {
                    color: #888;
                    font-size: 0.9rem;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    margin-top: 40px;
                    padding: 12px 25px;
                    background: white;
                    color: #4caf50;
                    text-decoration: none;
                    border-radius: 25px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    font-weight: 600;
                }
                .back-link:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Необычные цветы</h1>
                    <p class="page-subtitle">Экзотика и уникальность</p>
                </div>

                <div class="content-wrapper">
                    <div>
                        <img src="/images/2025-11-11%2022.23.43.jpg" alt="Необычные цветы" class="flower-image">
                    </div>
                    <div>
                        <ul class="flower-list">
                            <li class="flower-item">
                                <span class="flower-name">Орхидеи</span>
                                <span class="flower-price">от 500 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Стрелиции</span>
                                <span class="flower-price">от 450 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Протеи</span>
                                <span class="flower-price">от 600 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Антуриумы</span>
                                <span class="flower-price">от 400 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Герберы</span>
                                <span class="flower-price">от 200 руб</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <a href="/" class="back-link">← Вернуться на главную</a>
            </div>
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
            <title>Свадебные цветы - Flowers by Sabi</title>
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Source Sans Pro', sans-serif;
                    background: linear-gradient(135deg, #f0f8ff 0%, #fff8f8 100%);
                    min-height: 100vh;
                    color: #5a5a5a;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }
                .page-header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(33, 150, 243, 0.1);
                }
                .page-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: 3.5rem;
                    color: #2196f3;
                    margin-bottom: 10px;
                }
                .page-subtitle {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    color: #888;
                }
                .content-wrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 40px;
                    align-items: start;
                }
                .flower-image {
                    width: 100%;
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                .flower-image:hover {
                    transform: scale(1.02);
                }
                .flower-list {
                    list-style: none;
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }
                .flower-item {
                    padding: 15px 20px;
                    margin-bottom: 15px;
                    background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
                    border-radius: 12px;
                    border-left: 4px solid #2196f3;
                    transition: all 0.3s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .flower-item:hover {
                    transform: translateX(10px);
                    box-shadow: 0 5px 15px rgba(33, 150, 243, 0.2);
                }
                .flower-name {
                    font-weight: 600;
                    color: #2196f3;
                }
                .flower-price {
                    color: #888;
                    font-size: 0.9rem;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    margin-top: 40px;
                    padding: 12px 25px;
                    background: white;
                    color: #2196f3;
                    text-decoration: none;
                    border-radius: 25px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    font-weight: 600;
                }
                .back-link:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Свадебные цветы</h1>
                    <p class="page-subtitle">Создаем сказку для вашего дня</p>
                </div>

                <div class="content-wrapper">
                    <div>
                        <img src="/images/2025-11-11%2022.23.47.jpg" alt="Свадебные цветы" class="flower-image">
                    </div>
                    <div>
                        <ul class="flower-list">
                            <li class="flower-item">
                                <span class="flower-name">Свадебные букеты невесты</span>
                                <span class="flower-price">от 3000 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Бутоньерки для жениха</span>
                                <span class="flower-price">от 500 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Цветочные арки</span>
                                <span class="flower-price">от 5000 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Букеты для подружек невесты</span>
                                <span class="flower-price">от 1500 руб</span>
                            </li>
                            <li class="flower-item">
                                <span class="flower-name">Свадебные композиции</span>
                                <span class="flower-price">от 2000 руб</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <a href="/" class="back-link">← Вернуться на главную</a>
            </div>
        </body>
        </html>
    `);
});

/* GET отдельный цветок через EJS шаблон */
router.get('/flower/:name', function(req, res, next) {
    const flowerName = req.params.name;
    
    // Данные для разных цветов
    const flowers = {
        'rose': {
            title: 'Красная роза',
            picture: '/images/2025-11-11%2022.23.35.jpg',
            desc: 'Красная роза — символ страстной любви и романтики. Каждый лепесток источает нежность и элегантность, делая этот цветок идеальным выбором для особых моментов. Наши розы выращиваются с особой заботой и вниманием к деталям.'
        },
        'exotic': {
            title: 'Экзотический цветок',
            picture: '/images/2025-11-11%2022.23.43.jpg', 
            desc: 'Уникальные экзотические цветы, привезенные из самых отдаленных уголков мира. Их необычная форма и яркие цвета создают неповторимую атмосферу волшебства. Каждый цветок — это настоящее произведение искусства природы.'
        },
        'wedding': {
            title: 'Свадебная композиция',
            picture: '/images/2025-11-11%2022.23.47.jpg',
            desc: 'Изысканная свадебная композиция, созданная специально для самого важного дня в вашей жизни. Нежные оттенки и гармоничное сочетание цветов подчеркнут красоту момента и создадут атмосферу настоящей сказки.'
        }
    };
    
    const flower = flowers[flowerName] || {
        title: 'Цветок',
        picture: '/images/default.jpg',
        desc: 'Прекрасный цветок из нашей коллекции.'
    };
    

    res.render('rose', flower);
});

module.exports = router;