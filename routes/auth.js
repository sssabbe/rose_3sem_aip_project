var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

// Импортируем middleware
const authMiddleware = require('../middlewares/authMiddleware');

// GET /auth/login - страница входа
router.get('/login', function(req, res, next) {
    // Если уже авторизован - редирект на главную
    if (req.session.userId) {
        req.flash('info', 'Вы уже вошли в систему');
        return res.redirect('/');
    }
    
    res.render('auth/login', {
        title: 'Вход в систему'
        // flash сообщения уже в res.locals благодаря middleware
    });
});

// POST /auth/login - обработка входа
router.post('/login', async function(req, res, next) {
    try {
        // Получаем данные из формы
        var username = req.body.username;
        var password = req.body.password;
        var remember = req.body.remember;
        
        console.log('📨 Попытка входа:', username);
        
        // Проверяем, что поля не пустые
        if (!username || !password) {
            req.flash('error', 'Пожалуйста, заполните все поля');
            req.session.rememberUsername = username;
            return res.redirect('/auth/login');
        }
        
        // Ищем пользователя в базе данных
        var user = await User.findByUsernameOrEmail(username);
        
        if (!user) {
            req.flash('error', 'Пользователь не найден');
            req.session.rememberUsername = username;
            console.log('❌ Пользователь не найден:', username);
            return res.redirect('/auth/login');
        }
        
        // Проверяем пароль
        if (!user.checkPassword(password)) {
            req.flash('error', 'Неверный пароль');
            req.session.rememberUsername = username;
            console.log('❌ Неверный пароль для:', username);
            return res.redirect('/auth/login');
        }
        
        // Проверяем, активен ли пользователь
        if (!user.isActive) {
            req.flash('error', 'Учетная запись деактивирована');
            req.session.rememberUsername = username;
            return res.redirect('/auth/login');
        }
        
        // Сохраняем пользователя в сессии
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        };
        
        // Запоминаем логин в куках, если выбрано "запомнить меня"
        if (remember) {
            res.cookie('rememberedUser', username, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
        } else {
            res.clearCookie('rememberedUser');
        }
        
        // Обновляем время последнего входа
        await user.updateLastLogin();
        
        console.log('✅ Успешный вход пользователя:', user.username);
        
        // Успешное сообщение
        req.flash('success', `Добро пожаловать, ${user.fullName || user.username}!`);
        
        // Редирект на сохраненный URL или на главную
        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo;
        
        res.redirect(returnTo);
        
    } catch (err) {
        console.error('❌ Ошибка при входе:', err);
        req.flash('error', 'Ошибка сервера при входе. Попробуйте позже.');
        res.redirect('/auth/login');
    }
});

// GET /auth/register - страница регистрации
router.get('/register', function(req, res, next) {
    // Если уже авторизован - редирект на главную
    if (req.session.userId) {
        req.flash('info', 'Вы уже зарегистрированы и вошли в систему');
        return res.redirect('/');
    }
    
    res.render('auth/register', {
        title: 'Регистрация'
        // flash сообщения уже в res.locals
    });
});

// POST /auth/register - обработка регистрации
router.post('/register', async function(req, res, next) {
    try {
        // Получаем данные из формы
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;
        var fullName = req.body.fullName;
        var phone = req.body.phone;
        var terms = req.body.terms;
        
        console.log('📨 Попытка регистрации:', username, email);
        
        // Валидация данных
        if (!username || !password || !email) {
            req.flash('error', 'Пожалуйста, заполните все обязательные поля');
            return res.redirect('/auth/register');
        }
        
        if (password !== confirmPassword) {
            req.flash('error', 'Пароли не совпадают');
            return res.redirect('/auth/register');
        }
        
        if (password.length < 6) {
            req.flash('error', 'Пароль должен содержать минимум 6 символов');
            return res.redirect('/auth/register');
        }
        
        if (!terms) {
            req.flash('error', 'Необходимо согласиться с условиями использования');
            return res.redirect('/auth/register');
        }
        
        // Проверяем email на валидность
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', 'Пожалуйста, введите корректный email адрес');
            return res.redirect('/auth/register');
        }
        
        // Проверяем, существует ли пользователь
        var existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
        
        if (existingUser) {
            if (existingUser.username === username) {
                req.flash('error', 'Пользователь с таким именем уже существует');
            } else {
                req.flash('error', 'Пользователь с таким email уже существует');
            }
            return res.redirect('/auth/register');
        }
        
        // Создаем нового пользователя
        var newUser = new User({
            username: username,
            email: email,
            password: password,
            fullName: fullName || username,
            phone: phone,
            role: 'user',
            isActive: true
        });
        
        await newUser.save();
        
        console.log('✅ Новый пользователь создан:', newUser.username);
        
        // Автоматически входим после регистрации
        req.session.userId = newUser._id;
        req.session.username = newUser.username;
        req.session.role = newUser.role;
        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role
        };
        
        req.flash('success', 'Регистрация прошла успешно! Добро пожаловать!');
        res.redirect('/');
        
    } catch (err) {
        console.error('❌ Ошибка при регистрации:', err);
        req.flash('error', 'Ошибка при регистрации: ' + err.message);
        res.redirect('/auth/register');
    }
});

// GET /auth/logout - выход из системы
router.get('/logout', function(req, res, next) {
    var username = req.session.username || 'Гость';
    
    req.session.destroy(function(err) {
        if (err) {
            console.error('❌ Ошибка при выходе:', err);
            req.flash('error', 'Ошибка при выходе из системы');
            return res.redirect('/');
        }
        
        console.log('✅ Пользователь вышел из системы:', username);
        req.flash('success', 'Вы успешно вышли из системы');
        res.redirect('/');
    });
});

// GET /auth/profile - личный кабинет (используем middleware)
router.get('/profile', authMiddleware.isAuthenticated, function(req, res, next) {
    res.render('auth/profile', {
        title: 'Личный кабинет',
        user: req.session.user
    });
});

module.exports = router;