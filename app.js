var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');

var app = express();

// Подключение к MongoDB (БЕЗ ОШИБОК если нет MongoDB)
try {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/flowerShop2024', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('✅ MongoDB подключена');
} catch (err) {
    console.log('⚠️ MongoDB не подключена, но сервер работает');
}

// УПРОЩЕННАЯ НАСТРОЙКА СЕССИЙ (работает БЕЗ MongoDB)
app.use(session({
    secret: 'rose-shop-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 // 24 часа
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware для передачи данных сессии в шаблоны
app.use(function(req, res, next) {
    res.locals.user = req.session.user || null;
    next();
});

// РОУТЫ
app.use('/', indexRouter);

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
        message: err.message,
        error: err
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`🌹 Магазин цветов работает!`);
});

module.exports = app;