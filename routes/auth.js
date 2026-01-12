var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET /auth/login - страница входа
router.get('/login', function(req, res, next) {
    res.render('auth/login', {
        title: 'Вход в систему'
    });
});

// POST /auth/login - обработка входа
router.post('/login', async function(req, res, next) {
    try {
        // Получаем данные из формы
        var username = req.body.username;
        var password = req.body.password;
        
        console.log('📨 Получены данные формы:');
        console.log('- Имя пользователя:', username);
        console.log('- Пароль:', password);
        
        // Проверяем, что поля не пустые
        if (!username || !password) {
            req.flash('error', 'Пожалуйста, заполните все поля');
            return res.redirect('/auth/login');
        }
        
        // Ищем пользователя в базе данных
        var user = await User.findByUsernameOrEmail(username);
        
        if (!user) {
            req.flash('error', 'Пользователь не найден');
            return res.redirect('/auth/login');
        }
        
        // Проверяем пароль
        if (!user.checkPassword(password)) {
            req.flash('error', 'Неверный пароль');
            return res.redirect('/auth/login');
        }
        
        // Проверяем, активен ли пользователь
        if (!user.isActive) {
            req.flash('error', 'Учетная запись деактивирована');
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
        
        // Обновляем время последнего входа
        await user.updateLastLogin();
        
        console.log('✅ Успешный вход пользователя:', user.username);
        
        // Перенаправляем на главную страницу
        req.flash('success', `Добро пожаловать, ${user.fullName}!`);
        res.redirect('/');
        
    } catch (err) {
        console.error('❌ Ошибка при входе:', err);
        req.flash('error', 'Ошибка сервера при входе');
        res.redirect('/auth/login');
    }
});

// GET /auth/register - страница регистрации
router.get('/register', function(req, res, next) {
    res.render('auth/register', {
        title: 'Регистрация'
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
        
        console.log('📨 Получены данные регистрации:');
        console.log('- Имя пользователя:', username);
        console.log('- Email:', email);
        console.log('- Пароль:', password ? '***' : 'не указан');
        console.log('- Полное имя:', fullName);
        console.log('- Телефон:', phone);
        
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
            role: 'user'
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
        req.flash('info', 'Вы успешно вышли из системы');
        res.redirect('/');
    });
});

// GET /auth/profile - личный кабинет (только для авторизованных)
router.get('/profile', function(req, res, next) {
    if (!req.session.userId) {
        req.flash('error', 'Для доступа к этой странице необходимо войти в систему');
        return res.redirect('/auth/login');
    }
    
    res.render('auth/profile', {
        title: 'Личный кабинет',
        user: req.session.user
    });
});

module.exports = router;