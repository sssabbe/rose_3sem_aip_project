// ПРАВИЛЬНЫЙ ИМПОРТ - так как экспорт { User }
const User = require("../models/user").User;

module.exports = async function(req, res, next) {
    // Инициализируем переменные
    res.locals.user = null;
    res.locals.currentUser = null;
    res.locals.isAuthenticated = false;
    res.locals.isAdmin = false;
    res.locals.cartItemCount = 0;
    res.locals.userName = 'Гость';
    
    console.log('🔍 createUser middleware запущен');
    console.log('   Session userId:', req.session.userId);
    
    // Считаем товары в корзине
    if (req.session.cart && req.session.cart.items) {
        res.locals.cartItemCount = req.session.cart.items.reduce((total, item) => {
            return total + (item.quantity || 0);
        }, 0);
        console.log('   Товаров в корзине:', res.locals.cartItemCount);
    }
    
    // Проверяем, есть ли userId в сессии
    if (req.session && req.session.userId) {
        try {
            console.log('🔄 Поиск пользователя по ID:', req.session.userId);
            
            // Ищем пользователя по ID
            const user = await User.findById(req.session.userId);
            
            if (user) {
                console.log('✅ Пользователь найден:', user.username);
                
                // Сохраняем пользователя в res.locals
                res.locals.user = user;
                res.locals.currentUser = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName || user.username,
                    role: user.role
                };
                res.locals.isAuthenticated = true;
                res.locals.isAdmin = user.role === 'admin';
                res.locals.userName = user.username;
            } else {
                // Пользователь не найден в БД, очищаем сессию
                console.log('❌ Пользователь не найден в БД, очищаем сессию');
                delete req.session.userId;
                delete req.session.username;
                delete req.session.user;
                delete req.session.role;
            }
        } catch (error) {
            console.error('🚨 Ошибка в createUser middleware:', error.message);
            console.error('   Детали:', error);
            // Продолжаем без пользователя
        }
    } else {
        console.log('👤 Пользователь не авторизован');
    }
    
    next();
};