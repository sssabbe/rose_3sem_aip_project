var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts'); // ← ДОБАВИТЬ
var mongoose = require('mongoose'); // ← ДОБАВИТЬ если используете БД

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');

var app = express();

// ПОДКЛЮЧЕНИЕ К MONGODB (если используете)
try {
  mongoose.connect('mongodb://localhost/flowerShop2024');
  console.log('✅ MongoDB подключена: mongodb://localhost/flowerShop2024');
} catch (err) {
  console.error('❌ Ошибка подключения к MongoDB:', err.message);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Использование EJS layouts
app.use(expressLayouts);
app.set('layout', 'layout/page'); // ← УКАЖИТЕ ПУТЬ К ВАШЕМУ LAYOUT

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// РОУТЫ
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);

// Тестовый маршрут (должен работать всегда)
app.get('/test', (req, res) => {
  res.send('✅ Сервер работает!');
});

app.get('/hello', (req, res) => {
  res.send('👋 Привет!');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Flower Shop - Ошибка' });
});

// Запуск на порту (используйте переменную окружения)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

module.exports = app;