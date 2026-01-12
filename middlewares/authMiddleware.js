module.exports = {
    // Middleware для добавления данных пользователя в res.locals
    userData: function(req, res, next) {
        res.locals.isAuthenticated = !!req.session.userId;
        res.locals.currentUser = req.session.user || null;
        res.locals.isAdmin = req.session.role === 'admin';
        res.locals.userName = req.session.username || req.cookies.userName || 'Гость';
        next();
    },
    
    // Проверка авторизации
    isAuthenticated: function(req, res, next) {
        if (req.session.userId) {
            return next();
        }
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Для доступа к этой странице необходимо войти в систему');
        res.redirect('/auth/login');
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