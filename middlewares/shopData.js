module.exports = function(req, res, next) {
    // Основная информация о магазине
    res.locals.shopInfo = {
        name: 'ROSE1 - Магазин роз',
        phone: '+7 (999) 123-45-67',
        email: 'info@rose1.ru',
        address: 'г. Москва, ул. Розовая, д. 1'
    };
    
    // Главное меню навигации
    res.locals.mainMenu = [
        { title: 'Главная', url: '/', active: req.path === '/' },
        { title: 'Розы', url: '/roses', active: req.path === '/roses' },
        { title: 'Букеты', url: '/bouquets', active: req.path === '/bouquets' },
        { title: 'Цветы', url: '/flowers', active: req.path === '/flowers' },
        { title: 'Аксессуары', url: '/accessories', active: req.path === '/accessories' },
        { title: 'Свадебные', url: '/wedding', active: req.path === '/wedding' },
        { title: 'Необычные', url: '/unusual', active: req.path === '/unusual' }
    ];
    
    // Информация о корзине
    res.locals.cartItemCount = req.session.cart ? 
        req.session.cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    
    res.locals.cartTotal = req.session.cart ? req.session.cart.total : 0;
    
    // Информация о пользователе
    res.locals.userName = req.cookies.userName || req.session.userName || 'Гость';
    
    next();
};