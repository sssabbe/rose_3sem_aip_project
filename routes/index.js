// routes/index.js
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Получаем значение куки, если есть
  var visitCount = parseInt(req.cookies.visitCount) || 0;
  var lastVisit = req.cookies.lastVisit || 'первый раз';
  var userName = req.cookies.userName || 'Гость';
  
  // Увеличиваем счетчик посещений
  visitCount++;
  
  // Устанавливаем/обновляем куки
  res.cookie('visitCount', visitCount, { 
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 дней
    httpOnly: true 
  });
  
  res.cookie('lastVisit', new Date().toLocaleString('ru-RU'), { 
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true 
  });
  
  res.cookie('greeting', 'Добро пожаловать в магазин цветов "Роза"!', {
    maxAge: 1000 * 60 * 60 * 24 // 24 часа
  });
  
  // Отображаем главную страницу с данными из кук
  res.render('index', { 
    title: 'Магазин цветов "Роза"',
    visitCount: visitCount,
    lastVisit: lastVisit,
    userName: userName,
    greeting: 'Добро пожаловать в магазин цветов "Роза"!'
  });
});

/* POST установить имя пользователя */
router.post('/set-name', function(req, res, next) {
  var userName = req.body.userName || 'Гость';
  
  // Устанавливаем куку с именем
  res.cookie('userName', userName, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 год
    httpOnly: true
  });
  
  res.redirect('/');
});

/* GET очистить куки */
router.get('/clear-cookies', function(req, res, next) {
  // Очищаем все куки
  res.clearCookie('visitCount');
  res.clearCookie('lastVisit');
  res.clearCookie('userName');
  res.clearCookie('greeting');
  
  res.redirect('/');
});

module.exports = router;