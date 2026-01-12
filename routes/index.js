var express = require('express');
var router = express.Router();

// Каталоги
const catalogs = {
    roses: [
        { 
            id: 'rose_red_1', 
            name: 'Алая страсть', 
            color: 'red', 
            price: 650, 
            oldPrice: 750,
            badge: 'Любовь',
            description: 'Классическая красная роза с бархатными лепестками.',
            category: 'roses'
        },
        { 
            id: 'rose_pink_1', 
            name: 'Нежный рассвет', 
            color: 'pink', 
            price: 550, 
            oldPrice: 650,
            badge: 'Нежность',
            description: 'Розовая роза с градиентом от нежно-розового к белому.',
            category: 'roses'
        },
        { 
            id: 'rose_white_1', 
            name: 'Белое облако', 
            color: 'white', 
            price: 600, 
            oldPrice: 700,
            badge: 'Чистота',
            description: 'Идеально белая роза с тонким ароматом.',
            category: 'roses'
        }
    ],
    
    bouquets: [
        {
            id: 'bouquet_101',
            name: 'Букет "101 роза"',
            price: 15000,
            description: 'Роскошный букет из 101 алой розы.',
            category: 'bouquets'
        },
        {
            id: 'bouquet_tenderness',
            name: 'Букет "Милая нежность"',
            price: 3500,
            description: 'Нежные розовые и белые розы с эвкалиптом.',
            category: 'bouquets'
        }
    ]
};

// Главная страница
router.get('/', function(req, res, next) {
    // Работа с куками
    var visitCount = parseInt(req.cookies.visitCount) || 0;
    var lastVisit = req.cookies.lastVisit || 'первый раз';
    
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
            itemCount: 0,
            lastUpdated: new Date().toLocaleString('ru-RU')
        };
    }
    
    // Рендерим страницу
    // Обратите внимание: переменные user и isAuthenticated уже есть в res.locals
    // благодаря middleware createUser
    res.render('index', { 
        title: 'Магазин цветов "Роза"',
        // Куки
        visitCount: visitCount,
        lastVisit: lastVisit,
        userName: req.cookies.userName || 'Гость',
        // Сессия
        sessionID: req.sessionID,
        sessionCounter: req.session.visitCount,
        lastRequest: req.session.lastVisit,
        firstVisit: req.session.firstVisit,
        // Корзина
        cart: req.session.cart,
        // Каталоги
        roses: catalogs.roses,
        bouquets: catalogs.bouquets
        // user и isAuthenticated уже есть в res.locals!
    });
});

// Страница входа/регистрации
router.get('/logreg', function(req, res, next) {
    // Если уже авторизован, редирект на главную
    if (res.locals.isAuthenticated) {
        return res.redirect('/');
    }
    
    res.render('logreg', {
        title: 'Вход / Регистрация',
        error: req.session.error || null,
        success: req.session.success || null
    });
    
    // Очищаем сообщения после показа
    delete req.session.error;
    delete req.session.success;
});

// Обработка входа/регистрации
router.post('/logreg', async function(req, res, next) {
    try {
        var username = req.body.username.trim();
        var password = req.body.password;
        
        const User = require('../models/user').User;
        var users = await User.find({username: username});
        
        if (!users.length) {
            // Регистрация
            var user = new User({
                username: username,
                password: password
            });
            
            await user.save();
            
            // Сохраняем в сессию
            req.session.user_id = user._id;
            req.session.username = user.username;
            req.session.success = 'Регистрация успешна! Добро пожаловать!';
            
            res.redirect('/');
            
        } else {
            // Авторизация
            var foundUser = users[0];
            
            if (foundUser.checkPassword(password)) {
                req.session.user_id = foundUser._id;
                req.session.username = foundUser.username;
                req.session.success = 'Вы успешно вошли в систему!';
                
                res.redirect('/');
                
            } else {
                req.session.error = 'Неверный пароль! Попробуйте снова.';
                res.redirect('/logreg');
            }
        }
        
    } catch (error) {
        console.error('Ошибка в logreg:', error);
        req.session.error = 'Произошла ошибка. Попробуйте позже.';
        res.redirect('/logreg');
    }
});

// Выход из системы
router.get('/logout', function(req, res, next) {
    console.log('Выход пользователя:', req.session.username);
    
    req.session.destroy(function(err) {
        if (err) {
            console.error('Ошибка при выходе:', err);
        }
        res.redirect('/');
    });
});

// Профиль пользователя
router.get('/profile', function(req, res, next) {
    // Проверяем авторизацию через middleware
    if (!res.locals.isAuthenticated) {
        req.session.error = 'Для просмотра профиля необходимо войти в систему';
        return res.redirect('/logreg');
    }
    
    res.render('profile', {
        title: 'Мой профиль',
        user: res.locals.user, // Получаем из middleware
        sessionInfo: {
            id: req.sessionID,
            visits: req.session.visitCount || 0,
            firstVisit: req.session.firstVisit
        }
    });
});

// Другие маршруты остаются без изменений...

module.exports = router;