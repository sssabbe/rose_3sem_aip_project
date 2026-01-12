module.exports = function(req, res, next) {
    // Данные магазина для футера
    res.locals.shopInfo = {
        phone: '+7 (999) 123-45-67',
        email: 'info@flowersbysabi.ru',
        address: 'г. Москва, ул. Цветочная, 1'
    };
    
    // Категории для меню
    res.locals.categories = [
        { name: 'Розы', url: '/roses', icon: 'fa-rose' },
        { name: 'Букеты', url: '/bouquets', icon: 'fa-birthday-cake' },
        { name: 'Подарки', url: '/gifts', icon: 'fa-gift' }
    ];
    
    // Для отладки
    res.locals.sessionExpires = 3600; // 1 час в секундах
    
    next();
};