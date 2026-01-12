module.exports = {
    // Middleware для добавления данных пользователя в res.locals
    userData: function(req, res, next) {
        res.locals.isAuthenticated = !!req.session.userId;
        res.locals.currentUser = req.session.user || null;
        res.locals.user = req.session.user || null;
        res.locals.isAdmin = req.session.role === 'admin';
        res.locals.userName = req.session.username || req.cookies.userName || 'Гость';
        next();
    },
    
    // Проверка авторизации (ваш checkAuth.js)
    isAuthenticated: function(req, res, next) {
        console.log('🔐 Проверка авторизации:', req.session.userId ? 'авторизован' : 'не авторизован');
        
        if (!req.session.userId) {
            // Сохраняем URL для возврата после входа
            req.session.returnTo = req.originalUrl || req.url;
            
            // Устанавливаем сообщение об ошибке через flash
            req.flash('error', 'Для доступа к этой странице необходимо войти в систему');
            console.log('❌ Доступ запрещен: пользователь не авторизован');
            
            // Редирект на страницу входа
            return res.redirect('/auth/login');
        }
        
        console.log('✅ Доступ разрешен для пользователя ID:', req.session.userId);
        next();
    },
    
    // Проверка на администратора
    isAdmin: function(req, res, next) {
        if (req.session.userId && req.session.role === 'admin') {
            return next();
        }
        req.flash('error', 'У вас нет прав для доступа к этой странице');
        res.redirect('/');
    }
};