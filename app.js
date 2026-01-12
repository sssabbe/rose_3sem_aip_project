const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// ========== ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ ==========
// Раскомментируйте, когда будете готовы использовать MongoDB
// mongoose.connect('mongodb://localhost:27017/flower-shop', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('✅ MongoDB подключена'))
// .catch(err => console.log('⚠️ MongoDB не подключена, работаем без БД'));

// ========== MIDDLEWARE ПОРЯДОК ВАЖЕН! ==========
// 1. Парсер куков (должен быть первым!)
app.use(cookieParser());

// 2. Сессии (должен быть перед flash)
app.use(session({
    secret: 'flower-shop-secret-key-12345',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // true для HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 часа
    }
}));

// 3. Flash сообщения (должен быть после сессии)
app.use(flash());

// 4. Парсеры тела запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// 6. Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========== КАСТОМНЫЕ MIDDLEWARE ==========
// 7. Передача flash сообщений в res.locals
app.use(function(req, res, next) {
    // Flash сообщения (connect-flash)
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.warning = req.flash('warning');
    
    // Текущий путь
    res.locals.currentPath = req.path;
    
    // Окружение
    res.locals.isDevelopment = process.env.NODE_ENV === 'development';
    
    next();
});

// 8. Middleware для пользовательских данных
const authMiddleware = require('./middlewares/authMiddleware');
app.use(authMiddleware.userData);

// 9. Middleware для данных магазина
const shopDataMiddleware = require('./middlewares/shopData');
app.use(shopDataMiddleware);

// 10. Middleware для статистики посещений
app.use(function(req, res, next) {
    // Счетчик посещений в сессии
    if (!req.session.visitCount) {
        req.session.visitCount = 0;
        req.session.firstVisit = new Date().toLocaleString('ru-RU');
    }
    req.session.visitCount++;
    req.session.lastVisit = new Date().toLocaleString('ru-RU');
    
    // Передаем в шаблоны
    res.locals.sessionCounter = req.session.visitCount;
    res.locals.lastRequest = req.session.lastVisit;
    res.locals.firstVisit = req.session.firstVisit;
    res.locals.sessionID = req.sessionID;
    
    // Счетчик посещений в куках
    let cookieVisitCount = parseInt(req.cookies.visitCount) || 0;
    cookieVisitCount++;
    
    res.cookie('visitCount', cookieVisitCount, { 
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true 
    });
    
    res.cookie('lastVisit', new Date().toLocaleString('ru-RU'), { 
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true 
    });
    
    res.locals.visitCount = cookieVisitCount;
    
    next();
});

// 11. Middleware для меню навигации
app.use(function(req, res, next) {
    // Базовое меню
    let menuItems = [
        { 
            title: 'Главная', 
            url: '/', 
            icon: '<i class="fas fa-home"></i>',
            isActive: req.path === '/'
        }
    ];
    
    // Добавляем категории из shopData
    if (res.locals.categories) {
        res.locals.categories.forEach(category => {
            menuItems.push({
                title: category.name,
                url: category.url,
                icon: `<i class="fas ${category.icon}"></i>`,
                isActive: req.path.startsWith(category.url)
            });
        });
    }
    
    // Для авторизованных пользователей
    if (res.locals.isAuthenticated) {
        menuItems.push(
            { 
                title: 'Корзина', 
                url: '/cart', 
                icon: '<i class="fas fa-shopping-cart"></i>',
                isActive: req.path === '/cart'
            }
        );
    }
    
    // О компании
    menuItems.push(
        { 
            title: 'Контакты', 
            url: '/contact', 
            icon: '<i class="fas fa-phone"></i>',
            isActive: req.path === '/contact'
        },
        { 
            title: 'О нас', 
            url: '/about', 
            icon: '<i class="fas fa-info-circle"></i>',
            isActive: req.path === '/about'
        }
    );
    
    res.locals.nav = menuItems;
    
    // Счетчик корзины (заглушка, нужно реализовать логику)
    res.locals.cartItemCount = req.session.cart ? 
        req.session.cart.items.length : 0;
    
    next();
});

// ========== ПОДКЛЮЧЕНИЕ РОУТОВ ==========
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/auth', authRouter);

// ========== ЗАЩИЩЕННЫЕ МАРШРУТЫ ==========
// Профиль пользователя
app.get('/profile', authMiddleware.isAuthenticated, function(req, res) {
    res.render('profile', {
        title: 'Личный кабинет',
        user: req.session.user
    });
});

// Корзина
app.get('/cart', authMiddleware.isAuthenticated, function(req, res) {
    // Если корзины нет в сессии, создаем пустую
    if (!req.session.cart) {
        req.session.cart = {
            items: [],
            total: 0,
            itemCount: 0
        };
    }
    
    res.render('cart', {
        title: 'Корзина',
        cart: req.session.cart
    });
});

// ========== СТАТИЧЕСКИЕ СТРАНИЦЫ ==========
app.get('/about', function(req, res) {
    res.render('about', {
        title: 'О нас'
    });
});

app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Контакты'
    });
});

// ========== ОБРАБОТКА ОШИБОК ==========
// 404
app.use(function(req, res, next) {
    res.status(404).render('404', { 
        title: 'Страница не найдена' 
    });
});

// 500
app.use(function(err, req, res, next) {
    console.error('💥 Ошибка сервера:', err);
    res.status(500).render('500', { 
        title: 'Ошибка сервера',
        error: res.locals.isDevelopment ? err : null
    });
});

// ========== ЗАПУСК СЕРВЕРА ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
    console.log(`📁 Режим: ${process.env.NODE_ENV || 'development'}`);
});