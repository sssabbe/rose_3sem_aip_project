var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose'); // <-- ДОБАВЛЕНО

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// Добавим маршруты для цветочного магазина:
var bouquetsRouter = require('./routes/bouquets');
var flowersRouter = require('./routes/flowers');
var accessoriesRouter = require('./routes/accessories');

var app = express();

// ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ MongoDB
try {
  mongoose.connect('mongodb://localhost/flowerShop2024');
  console.log('✅ MongoDB подключена: mongodb://localhost/flowerShop2024');
} catch (err) {
  console.error('❌ Ошибка подключения к MongoDB:', err.message);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Использование EJS layouts и указание пути к layout файлу
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
app.use('/bouquets', bouquetsRouter);     // Букеты
app.use('/flowers', flowersRouter);       // Цветы
app.use('/accessories', accessoriesRouter); // Аксессуары

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

module.exports = app;