var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');

var app = express();

// ПОДКЛЮЧЕНИЕ К MONGODB
try {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/flowerShop2024');
    console.log('✅ MongoDB подключена');
} catch (err) {
    console.log('⚠️ MongoDB не подключена');
}

// 🆗 НАСТРОЙКА СЕССИЙ
try {
    var MongoStore = require('connect-mongo');
    
    // НАСТРОЙКА СЕССИЙ
    app.use(session({
        secret: 'ThreeCats',
        cookie: { maxAge: 60 * 1000 }, // 60 секунд
        proxy: true,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({  // Для connect-mongo v4+
            mongoUrl: 'mongodb://localhost/flowerShop2024',
            ttl: 60 // 60 секунд
        })
    }));
    console.log('✅ Используется connect-mongo v4+');
    
} catch (err) {
    // 🆗 СПОСОБ 2: Для старых версий connect-mongo (v3)
    try {
        var MongoStore = require('connect-mongo')(session);
        
        app.use(session({
            secret: 'ThreeCats',
            cookie: { maxAge: 60 * 1000 },
            proxy: true,
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({  // Для connect-mongo v3
                url: 'mongodb://localhost/flowerShop2024',
                ttl: 60
            })
        }));
        console.log('✅ Используется connect-mongo v3');
        
    } catch (err2) {
        // 🆗 СПОСОБ 3: Без MongoDB (в памяти)
        app.use(session({
            secret: 'ThreeCats',
            cookie: { maxAge: 60 * 1000 },
            proxy: true,
            resave: true,
            saveUninitialized: true
            // store не указываем - сессии в памяти
        }));
        console.log('✅ Используется хранение сессий в памяти');
    }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ========================
// 🔧 ВАШИ MIDDLEWARE
// ========================

// 🆕 СЧЁТЧИК ПОСЕЩЕНИЙ СТРАНИЦ
app.use(function(req, res, next) {
    // Увеличиваем счётчик на 1 при каждом запросе
    req.session.counter = (req.session.counter || 0) + 1;
    
    // Также сохраняем время последнего запроса
    req.session.lastRequest = new Date().toLocaleString('ru-RU');
    
    next();
});

// 🆕 ДАННЫЕ СЕССИИ ДЛЯ ШАБЛОНОВ
app.use(require('./middlewares/sessionData.js'));

// 🆕 МЕНЮ НАВИГАЦИИ
app.use(require('./middlewares/createMenu.js'));

// 🆕 ОБРАБОТКА КОРЗИНЫ
app.use(require('./middlewares/cartMiddleware.js'));

// 🆕 ОСНОВНЫЕ ДАННЫЕ МАГАЗИНА
app.use(require('./middlewares/shopData.js'));

// ========================
// 📌 РОУТЫ
// ========================
app.use('/', indexRouter);

// Маршрут для просмотра данных сессии
app.get('/session-info', (req, res) => {
    res.json({
        sessionID: req.sessionID,
        counter: req.session.counter || 0,
        lastRequest: req.session.lastRequest || 'никогда',
        sessionData: req.session
    });
});

// Маршрут для теста счётчика
app.get('/counter-test', (req, res) => {
    res.send(`
        <h1>Тест счётчика сессии</h1>
        <p>Текущее значение счётчика: <strong>${req.session.counter || 0}</strong></p>
        <p>Обнови страницу - счётчик увеличится!</p>
        <p><a href="/">На главную</a></p>
        <p><a href="/session-info">Посмотреть все данные сессии (JSON)</a></p>
    `);
});

// Маршрут для теста middleware
app.get('/test-middleware', (req, res) => {
    res.send(`
        <h1>Тест middleware</h1>
        <h2>Доступные переменные:</h2>
        <ul>
            <li>sessionID: ${res.locals.sessionID}</li>
            <li>sessionCounter: ${res.locals.sessionCounter}</li>
            <li>lastRequest: ${res.locals.lastRequest}</li>
            <li>cartItemCount: ${res.locals.cartItemCount}</li>
            <li>userName: ${res.locals.userName}</li>
            <li>shopInfo.name: ${res.locals.shopInfo ? res.locals.shopInfo.name : 'нет'}</li>
        </ul>
        <p><a href="/">На главную</a></p>
    `);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    res.status(err.status || 500);
    res.render('error', { 
        title: 'Ошибка',
        message: err.message
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 СЕРВЕР ЗАПУЩЕН!`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 http://localhost:${PORT}/counter-test - тест счётчика`);
    console.log(`👉 http://localhost:${PORT}/session-info - данные сессии`);
    console.log(`👉 http://localhost:${PORT}/test-middleware - тест middleware`);
    console.log(`\n📊 Сессии обновляются каждые 60 секунд`);
    console.log(`🎯 Счётчик увеличивается при каждом запросе`);
    console.log(`🔧 Подключены middleware: sessionData, createMenu, cartMiddleware, shopData`);
});

module.exports = app;