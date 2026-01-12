var express = require('express');
var router = express.Router();
var checkAuth = require("../middlewares/checkAuth.js"); // ← ДОБАВЬТЕ ЭТОТ ИМПОРТ

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

// ========== ОБЩЕДОСТУПНЫЕ СТРАНИЦЫ ==========

// Главная страница (доступна всем)
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

// Страница входа/регистрации (доступна всем)
router.get('/logreg', function(req, res, next) {
    // Если уже авторизован, редирект на главную
    if (res.locals.isAuthenticated) {
        req.session.success = 'Вы уже вошли в систему';
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

// ========== ЗАЩИЩЕННЫЕ СТРАНИЦЫ (требуют авторизации) ==========

// Профиль пользователя (ЗАЩИЩЕН checkAuth)
router.get('/profile', checkAuth, function(req, res, next) {
    res.render('profile', {
        title: 'Мой профиль',
        user: res.locals.user,
        sessionInfo: {
            id: req.sessionID,
            visits: req.session.visitCount || 0,
            firstVisit: req.session.firstVisit
        }
    });
});

// Корзина (ЗАЩИЩЕН checkAuth)
router.get('/cart', checkAuth, function(req, res, next) {
    // Если корзины нет в сессии, создаем пустую
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            total: 0,
            itemCount: 0,
            lastUpdated: new Date().toLocaleString('ru-RU')
        };
    }
    
    res.render('cart', {
        title: 'Корзина',
        cart: req.session.cart
    });
});

// Страница оформления заказа (ЗАЩИЩЕН checkAuth)
router.get('/checkout', checkAuth, function(req, res, next) {
    // Проверяем, есть ли товары в корзине
    if (!req.session.cart || req.session.cart.items.length === 0) {
        req.session.error = 'Ваша корзина пуста. Добавьте товары перед оформлением заказа.';
        return res.redirect('/cart');
    }
    
    res.render('checkout', {
        title: 'Оформление заказа',
        cart: req.session.cart
    });
});

// Мои заказы (ЗАЩИЩЕН checkAuth)
router.get('/orders', checkAuth, function(req, res, next) {
    // Здесь должна быть логика получения заказов из БД
    // Пока используем заглушку
    const orders = [];
    
    res.render('orders', {
        title: 'Мои заказы',
        orders: orders
    });
});

// ========== ДЕЙСТВИЯ (требуют авторизации) ==========

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
            
            // Редирект на сохраненный URL или на главную
            const returnTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            
            res.redirect(returnTo);
            
        } else {
            // Авторизация
            var foundUser = users[0];
            
            if (foundUser.checkPassword(password)) {
                req.session.user_id = foundUser._id;
                req.session.username = foundUser.username;
                req.session.success = 'Вы успешно вошли в систему!';
                
                // Редирект на сохраненный URL или на главную
                const returnTo = req.session.returnTo || '/';
                delete req.session.returnTo;
                
                res.redirect(returnTo);
                
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

// Добавление в корзину (ЗАЩИЩЕН checkAuth)
router.post('/add-to-cart', checkAuth, function(req, res, next) {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    
    // Ищем товар во всех каталогах
    let product = null;
    
    // Проверяем в розах
    product = catalogs.roses.find(r => r.id === productId);
    if (!product) {
        // Проверяем в букетах
        product = catalogs.bouquets.find(b => b.id === productId);
    }
    
    if (product) {
        // Инициализация корзины
        if (!req.session.cart) {
            req.session.cart = {
                items: [],
                total: 0,
                itemCount: 0,
                lastUpdated: new Date().toLocaleString('ru-RU')
            };
        }
        
        // Проверяем наличие товара в корзине
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
        
        // Пересчитываем сумму и количество
        req.session.cart.total = req.session.cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        req.session.cart.itemCount = req.session.cart.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
        
        req.session.cart.lastUpdated = new Date().toLocaleString('ru-RU');
        
        req.session.success = `Товар "${product.name}" добавлен в корзину!`;
    } else {
        req.session.error = 'Товар не найден';
    }
    
    res.redirect('/');
});

// Удаление из корзины (ЗАЩИЩЕН checkAuth)
router.post('/remove-from-cart', checkAuth, function(req, res, next) {
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
    
    res.redirect('/cart');
});

// Очистка корзины (ЗАЩИЩЕН checkAuth)
router.post('/clear-cart', checkAuth, function(req, res, next) {
    req.session.cart = {
        items: [],
        total: 0,
        itemCount: 0,
        lastUpdated: new Date().toLocaleString('ru-RU')
    };
    
    req.session.success = 'Корзина очищена!';
    res.redirect('/cart');
});

// Выход из системы
router.get('/logout', function(req, res, next) {
    console.log('Выход пользователя:', req.session.username);
    
    req.session.destroy(function(err) {
        if (err) {
            console.error('Ошибка при выходе:', err);
            req.session.error = 'Ошибка при выходе из системы';
            return res.redirect('/');
        }
        
        res.redirect('/');
    });
});

// ========== ОБЩЕДОСТУПНЫЕ КАТЕГОРИИ ==========

// Страница роз (доступна всем)
router.get('/roses', function(req, res, next) {
    res.render('categories/flowers', {
        title: 'Розы',
        products: catalogs.roses,
        category: 'roses'
    });
});

// Страница букетов (доступна всем)
router.get('/bouquets', function(req, res, next) {
    res.render('categories/bouquets', {
        title: 'Букеты',
        products: catalogs.bouquets,
        category: 'bouquets'
    });
});

module.exports = router;