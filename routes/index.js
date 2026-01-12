// routes/index.js
var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

// Каталоги (лучше вынести в отдельный модуль)
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

// Промежуточное ПО для проверки авторизации
function requireAuth(req, res, next) {
    if (!req.session.user_id) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/logreg');
    }
    next();
}

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
    
    // Получаем информацию о пользователе, если авторизован
    let user = null;
    if (req.session.user_id) {
        // Можно добавить загрузку из БД
        user = {
            username: req.session.username || 'Пользователь'
        };
    }
    
    // Рендерим страницу
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
        bouquets: catalogs.bouquets,
        // Пользователь
        user: user,
        isAuthenticated: !!req.session.user_id
    });
});

// Страница входа/регистрации
router.get('/logreg', function(req, res, next) {
    // Если уже авторизован, редирект на главную
    if (req.session.user_id) {
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
        
        console.log('Попытка входа/регистрации:', username);
        
        // Проверяем существование пользователя
        var users = await User.find({username: username});
        
        if (!users.length) {
            // Регистрация нового пользователя
            console.log('Создание нового пользователя:', username);
            
            var user = new User({
                username: username,
                password: password
            });
            
            await user.save();
            console.log('Пользователь создан с ID:', user._id);
            
            // Сохраняем в сессию
            req.session.user_id = user._id;
            req.session.username = username;
            req.session.success = 'Регистрация успешна! Добро пожаловать!';
            
            // Редирект на сохраненный URL или на главную
            const redirectTo = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            
            res.redirect(redirectTo);
            
        } else {
            // Авторизация существующего пользователя
            var foundUser = users[0];
            
            if (foundUser.checkPassword(password)) {
                console.log('Успешная авторизация для:', username);
                
                req.session.user_id = foundUser._id;
                req.session.username = foundUser.username;
                req.session.success = 'Вы успешно вошли в систему!';
                
                const redirectTo = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                
                res.redirect(redirectTo);
                
            } else {
                console.log('Неверный пароль для:', username);
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
    
    // Сохраняем корзину перед выходом (опционально)
    if (req.session.cart && req.session.cart.items.length > 0) {
        console.log('Корзина сохранена для будущего восстановления');
    }
    
    req.session.destroy(function(err) {
        if (err) {
            console.error('Ошибка при выходе:', err);
        }
        res.redirect('/');
    });
});

// Установка имени пользователя (для куков)
router.post('/set-name', function(req, res, next) {
    var userName = req.body.userName || 'Гость';
    
    res.cookie('userName', userName, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true
    });
    
    res.redirect('/');
});

// Добавление в корзину (требует авторизации)
router.post('/add-to-cart', requireAuth, function(req, res, next) {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    
    // Ищем товар во всех каталогах
    let product = null;
    
    for (let category in catalogs) {
        product = catalogs[category].find(item => item.id === productId);
        if (product) break;
    }
    
    if (product) {
        // Инициализация корзины, если нужно
        if (!req.session.cart) {
            req.session.cart = {
                items: [],
                total: 0,
                itemCount: 0,
                userId: req.session.user_id // Привязываем к пользователю
            };
        }
        
        // Проверяем наличие в корзине
        const existingIndex = req.session.cart.items.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            // Увеличиваем количество
            req.session.cart.items[existingIndex].quantity += quantity;
        } else {
            // Добавляем новый товар
            req.session.cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                category: product.category,
                addedAt: new Date().toLocaleString('ru-RU')
            });
        }
        
        // Пересчитываем
        req.session.cart.total = req.session.cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        req.session.cart.itemCount = req.session.cart.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
        
        req.session.cart.lastUpdated = new Date().toLocaleString('ru-RU');
        
        console.log('Товар добавлен в корзину:', product.name);
        req.session.success = `Товар "${product.name}" добавлен в корзину!`;
    } else {
        req.session.error = 'Товар не найден!';
    }
    
    res.redirect('/');
});

// Удаление из корзины
router.post('/remove-from-cart', requireAuth, function(req, res, next) {
    const productId = req.body.productId;
    
    if (req.session.cart) {
        const itemIndex = req.session.cart.items.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            const removedItem = req.session.cart.items[itemIndex];
            req.session.cart.items.splice(itemIndex, 1);
            
            // Пересчитываем
            req.session.cart.total = req.session.cart.items.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);
            
            req.session.cart.itemCount = req.session.cart.items.reduce((count, item) => {
                return count + item.quantity;
            }, 0);
            
            req.session.cart.lastUpdated = new Date().toLocaleString('ru-RU');
            
            req.session.success = `Товар "${removedItem.name}" удален из корзины`;
        }
    }
    
    res.redirect('/');
});

// Очистка корзины
router.post('/clear-cart', requireAuth, function(req, res, next) {
    req.session.cart = {
        items: [],
        total: 0,
        itemCount: 0,
        lastUpdated: new Date().toLocaleString('ru-RU'),
        userId: req.session.user_id
    };
    
    req.session.success = 'Корзина очищена!';
    res.redirect('/');
});

// Страница оформления заказа (требует авторизации)
router.get('/checkout', requireAuth, function(req, res, next) {
    if (!req.session.cart || req.session.cart.items.length === 0) {
        req.session.error = 'Ваша корзина пуста!';
        return res.redirect('/');
    }
    
    res.render('checkout', {
        title: 'Оформление заказа',
        cart: req.session.cart,
        user: {
            username: req.session.username
        }
    });
});

// Очистка куков
router.get('/clear-cookies', function(req, res, next) {
    res.clearCookie('visitCount');
    res.clearCookie('lastVisit');
    res.clearCookie('userName');
    
    req.session.success = 'Куки очищены!';
    res.redirect('/');
});

// Профиль пользователя
router.get('/profile', requireAuth, function(req, res, next) {
    res.render('profile', {
        title: 'Мой профиль',
        user: {
            username: req.session.username,
            userId: req.session.user_id
        },
        sessionInfo: {
            id: req.sessionID,
            visits: req.session.visitCount || 0,
            firstVisit: req.session.firstVisit
        }
    });
});

module.exports = router;