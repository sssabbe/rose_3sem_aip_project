var express = require('express');
var router = express.Router();

// Каталог роз
const rosesCatalog = [
    { 
        id: 'rose_red_1', 
        name: 'Алая страсть', 
        color: 'red', 
        price: 650, 
        oldPrice: 750,
        badge: 'Любовь',
        description: 'Классическая красная роза с бархатными лепестками.'
    },
    { 
        id: 'rose_pink_1', 
        name: 'Нежный рассвет', 
        color: 'pink', 
        price: 550, 
        oldPrice: 650,
        badge: 'Нежность',
        description: 'Розовая роза с градиентом от нежно-розового к белому.'
    },
    { 
        id: 'rose_white_1', 
        name: 'Белое облако', 
        color: 'white', 
        price: 600, 
        oldPrice: 700,
        badge: 'Чистота',
        description: 'Идеально белая роза с тонким ароматом.'
    }
];

// Каталог букетов
const bouquetsCatalog = [
    {
        id: 'bouquet_101',
        name: 'Букет "101 роза"',
        price: 15000,
        description: 'Роскошный букет из 101 алой розы.'
    },
    {
        id: 'bouquet_tenderness',
        name: 'Букет "Милая нежность"',
        price: 3500,
        description: 'Нежные розовые и белые розы с эвкалиптом.'
    }
];

// Главная страница
router.get('/', function(req, res, next) {
    // Работа с куками
    var visitCount = parseInt(req.cookies.visitCount) || 0;
    var lastVisit = req.cookies.lastVisit || 'первый раз';
    var userName = req.cookies.userName || 'Гость';
    
    visitCount++;
    
    // Устанавливаем куки
    res.cookie('visitCount', visitCount, { 
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true 
    });
    
    res.cookie('lastVisit', new Date().toLocaleString('ru-RU'), { 
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true 
    });
    
    // Работа с сессиями
    if (!req.session.visitCount) {
        req.session.visitCount = 0;
        req.session.firstVisit = new Date().toLocaleString('ru-RU');
    }
    req.session.visitCount++;
    req.session.lastVisit = new Date().toLocaleString('ru-RU');
    
    // Инициализация корзины
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            total: 0,
            lastUpdated: new Date().toLocaleString('ru-RU')
        };
    }
    
    // Рендерим страницу с ВСЕМИ переменными для сессии
    res.render('index', { 
        title: 'Магазин цветов "Роза"',
        visitCount: visitCount,
        lastVisit: lastVisit,
        userName: userName,
        // Переменные для блока информации о сессии
        sessionID: req.sessionID, // ← ВАЖНО: добавляем sessionID
        sessionCounter: req.session.visitCount, // ← счетчик сессии
        lastRequest: req.session.lastVisit, // ← последний запрос
        // Другие переменные
        firstVisit: req.session.firstVisit,
        cart: req.session.cart,
        roses: rosesCatalog,
        bouquets: bouquetsCatalog
    });
});

// Установка имени пользователя
router.post('/set-name', function(req, res, next) {
    var userName = req.body.userName || 'Гость';
    
    res.cookie('userName', userName, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true
    });
    
    req.session.userName = userName;
    
    res.redirect('/');
});

// Добавление в корзину
router.post('/add-to-cart', function(req, res, next) {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    
    // Ищем товар
    let product = null;
    product = rosesCatalog.find(r => r.id === productId);
    if (!product) {
        product = bouquetsCatalog.find(b => b.id === productId);
    }
    
    if (product) {
        if (!req.session.cart) {
            req.session.cart = {
                items: [],
                total: 0
            };
        }
        
        // Проверяем наличие в корзине
        const existingIndex = req.session.cart.items.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            req.session.cart.items[existingIndex].quantity += quantity;
        } else {
            req.session.cart.items.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toLocaleString('ru-RU')
            });
        }
        
        // Пересчитываем сумму
        req.session.cart.total = req.session.cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        req.session.cart.lastUpdated = new Date().toLocaleString('ru-RU');
    }
    
    res.redirect('/');
});

// Удаление из корзины
router.post('/remove-from-cart', function(req, res, next) {
    const productId = req.body.productId;
    
    if (req.session.cart) {
        req.session.cart.items = req.session.cart.items.filter(item => item.id !== productId);
        
        req.session.cart.total = req.session.cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        req.session.cart.lastUpdated = new Date().toLocaleString('ru-RU');
    }
    
    res.redirect('/');
});

// Очистка корзины
router.post('/clear-cart', function(req, res, next) {
    req.session.cart = {
        items: [],
        total: 0,
        lastUpdated: new Date().toLocaleString('ru-RU')
    };
    
    res.redirect('/');
});

// Очистка куков
router.get('/clear-cookies', function(req, res, next) {
    res.clearCookie('visitCount');
    res.clearCookie('lastVisit');
    res.clearCookie('userName');
    
    res.redirect('/');
});

// Тестовая страница
router.get('/test', function(req, res, next) {
    res.send('Тестовая страница работает!');
});

module.exports = router;