var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');

var app = express();

// ПОДКЛЮЧЕНИЕ К MONGODB
try {
  mongoose.connect('mongodb://localhost/flowerShop2024');
  console.log('✅ MongoDB подключена: mongodb://localhost/flowerShop2024');
} catch (err) {
  console.error('❌ Ошибка подключения к MongoDB:', err.message);
}

// НАСТРОЙКА СЕССИЙ
app.use(session({
  secret: 'rose-shop-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Middleware для передачи данных сессии в шаблоны
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Использование EJS layouts
app.use(expressLayouts);
app.set('layout', 'layout/page');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// РОУТЫ
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);

// Тестовый маршрут для проверки сессии
app.get('/session-test', (req, res) => {
  if (!req.session.visitCount) {
    req.session.visitCount = 0;
  }
  req.session.visitCount++;
  
  res.send(`
    <h1>Тест сессии</h1>
    <p>ID сессии: ${req.session.id}</p>
    <p>Количество посещений этой страницы: ${req.session.visitCount}</p>
    <p><a href="/">На главную</a></p>
  `);
});

// ТЕСТОВЫЙ МАРШРУТ ДЛЯ ПРОВЕРКИ КУК ← ДОБАВЛЕНО
app.get('/cookies-test', (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: req.headers.cookie,
        sessionID: req.sessionID,
        session: req.session
    });
});

// Маршрут для установки тестовой куки ← ДОБАВЛЕНО
app.get('/set-test-cookie', (req, res) => {
    res.cookie('testCookie', 'Это тестовая кука от цветочного магазина', {
        maxAge: 1000 * 60 * 60 * 24, // 24 часа
        httpOnly: true
    });
    res.cookie('flowerShop', 'Роза', {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 дней
    });
    res.send(`
        <h1>Куки установлены!</h1>
        <p>Были установлены тестовые куки:</p>
        <ul>
            <li>testCookie = "Это тестовая кука от цветочного магазина"</li>
            <li>flowerShop = "Роза"</li>
        </ul>
        <p><a href="/cookies-test">Посмотреть все куки</a></p>
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
  res.render('error', { title: 'Flower Shop - Ошибка' });
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`✅ Сессии настроены с ключом: rose-shop-secret-key-2024`);
  console.log(`🔧 Тестовые маршруты:`);
  console.log(`   - http://localhost:${PORT}/session-test - проверка сессий`);
  console.log(`   - http://localhost:${PORT}/cookies-test - проверка кук`);
  console.log(`   - http://localhost:${PORT}/set-test-cookie - установка тестовых кук`);
});

module.exports = app;