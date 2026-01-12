// Middleware для проверки авторизации пользователя
module.exports = function(req, res, next) {
    console.log('🔐 Проверка авторизации:', req.session.userId ? 'авторизован' : 'не авторизован');
    console.log('📁 Запрашиваемая страница:', req.originalUrl);
    
    if (!req.session.userId) {
        // Сохраняем URL, на который пытался зайти пользователь
        req.session.returnTo = req.originalUrl;
        
        // Устанавливаем сообщение об ошибке
        req.flash('error', 'Для доступа к этой странице необходимо войти в систему');
        console.log('❌ Доступ запрещен: пользователь не авторизован');
        
        // Редирект на страницу входа
        return res.redirect('/auth/login');
    }
    
    console.log('✅ Доступ разрешен');
    next();
};