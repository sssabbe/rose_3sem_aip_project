var express = require('express');
var router = express.Router();

// Страница входа
router.get('/login', function(req, res, next) {
    res.render('auth/login', {
        title: 'Вход в систему'
    });
});

// Обработка входа (упрощенная версия)
router.post('/login', function(req, res, next) {
    const { username, password } = req.body;
    
    // Простая проверка (в реальном проекте нужно подключить БД)
    if (username === 'admin' && password === 'admin123') {
        req.session.userId = 'test-user-id';
        req.session.username = 'admin';
        req.session.role = 'admin';
        req.session.user = {
            id: 'test-user-id',
            username: 'admin',
            fullName: 'Администратор'
        };
        
        req.flash('success', 'Добро пожаловать, Администратор!');
        res.redirect('/');
    } else if (username === 'user' && password === 'user123') {
        req.session.userId = 'test-user-id-2';
        req.session.username = 'user';
        req.session.role = 'user';
        req.session.user = {
            id: 'test-user-id-2',
            username: 'user',
            fullName: 'Пользователь'
        };
        
        req.flash('success', 'Добро пожаловать, Пользователь!');
        res.redirect('/');
    } else {
        req.flash('error', 'Неверное имя пользователя или пароль');
        res.redirect('/auth/login');
    }
});

// Страница регистрации
router.get('/register', function(req, res, next) {
    res.render('auth/register', {
        title: 'Регистрация'
    });
});

// Обработка регистрации
router.post('/register', function(req, res, next) {
    // Простая регистрация (в реальном проекте нужно сохранять в БД)
    const { username, email, password, fullName } = req.body;
    
    if (username && password) {
        req.session.userId = 'new-user-' + Date.now();
        req.session.username = username;
        req.session.role = 'user';
        req.session.user = {
            id: 'new-user-' + Date.now(),
            username: username,
            email: email,
            fullName: fullName || username
        };
        
        req.flash('success', `Добро пожаловать, ${username}! Регистрация успешна.`);
        res.redirect('/');
    } else {
        req.flash('error', 'Пожалуйста, заполните все обязательные поля');
        res.redirect('/auth/register');
    }
});

// Выход из системы
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.error('Ошибка выхода:', err);
        }
        req.flash('info', 'Вы успешно вышли из системы');
        res.redirect('/');
    });
});

module.exports = router;