const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

// Защищенные маршруты
router.get('/profile', auth.isAuthenticated, function(req, res) {
    res.render('protected/profile', {
        title: 'Личный кабинет',
        user: req.session.user
    });
});

router.get('/orders', auth.isAuthenticated, function(req, res) {
    res.render('protected/orders', {
        title: 'Мои заказы'
    });
});

// Админские маршруты
router.get('/admin/dashboard', auth.isAdmin, function(req, res) {
    res.render('admin/dashboard', {
        title: 'Панель администратора'
    });
});

module.exports = router;