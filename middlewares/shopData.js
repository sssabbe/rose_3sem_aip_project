module.exports = function(req, res, next) {
    // Данные магазина
    res.locals.shopInfo = {
        phone: '+7 (999) 123-45-67',
        email: 'info@flowersbysabi.ru',
        address: 'г. Москва, ул. Цветочная, 1'
    };
    
    // Статические категории для меню (если нужно)
    res.locals.categories = [
        { name: 'Розы', url: '/categories/roses', icon: 'fa-rose' },
        { name: 'Букеты', url: '/categories/bouquets', icon: 'fa-birthday-cake' },
        { name: 'Аксессуары', url: '/categories/accessories', icon: 'fa-gift' },
        { name: 'Подарки', url: '/categories/gifts', icon: 'fa-gift' }
    ];
    
    next();
};