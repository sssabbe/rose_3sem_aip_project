var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var session = require('express-session'); // ← ДОБАВЬТЕ ЭТУ СТРОКУ

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

// НАСТРОЙКА СЕССИЙ ← ДОБАВЬТЕ ЭТОТ БЛОК
app.use(session({
  secret: 'rose-shop-secret-key-2024', // Секретный ключ для подписи cookie
  resave: false, // Не сохранять сессию если не было изменений
  saveUninitialized: true, // Сохранять неинициализированные сессии
  cookie: { 
    secure: false, // true если используете HTTPS
    maxAge: 1000 * 60 * 60 * 24 // Время жизни cookie: 24 часа
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
  // Увеличиваем счетчик посещений
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
});

module.exports = app;