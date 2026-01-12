const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Все маршруты в этом файле требуют авторизации
router.use(authMiddleware.isAuthenticated);

// Личный кабинет
router.get('/profile', function(req, res) {
    res.render('profile', {
        title: 'Личный кабинет',
        user: req.session.user
    });
});

// Изменение профиля
router.post('/profile/update', function(req, res) {
    // Логика обновления профиля
    req.flash('success', 'Профиль успешно обновлен');
    res.redirect('/protected/profile');
});

// Страница только для администраторов
router.get('/admin', authMiddleware.isAdmin, function(req, res) {
    res.render('admin/dashboard', {
        title: 'Административная панель'
    });
});

module.exports = router;