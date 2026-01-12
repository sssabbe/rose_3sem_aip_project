// Если у вас есть модель Category в MongoDB
try {
    var Category = require("../models/category").Category;
} catch (err) {
    // Если модели нет, используем статические данные
    var Category = null;
}

module.exports = async function(req, res, next) {
    // Начинаем с пустого меню
    res.locals.nav = [];
    
    // Если есть модель Category, загружаем из БД
    if (Category) {
        try {
            // Загружаем все категории, отсортированные по порядку
            var categories = await Category.find({ isActive: true })
                .sort({ order: 1 })
                .select('title slug url icon isActive');
            
            if (categories && categories.length > 0) {
                res.locals.nav = categories.map(cat => ({
                    title: cat.title,
                    url: cat.url || `/category/${cat.slug}`,
                    icon: cat.icon || '📁',
                    isActive: req.path.includes(cat.slug)
                }));
            }
        } catch (err) {
            console.log('❌ Ошибка загрузки меню из БД:', err.message);
        }
    }
    
    // Если нет категорий в БД или произошла ошибка - используем статическое меню
    if (res.locals.nav.length === 0) {
        res.locals.nav = [
            { title: 'Главная', url: '/', icon: '🏠', isActive: req.path === '/' },
            { title: 'Все розы', url: '/roses', icon: '🌹', isActive: req.path === '/roses' },
            { title: 'Букеты', url: '/bouquets', icon: '💐', isActive: req.path === '/bouquets' },
            { title: 'Цветы', url: '/flowers', icon: '🌸', isActive: req.path === '/flowers' },
            { title: 'Свадебные', url: '/wedding', icon: '👰', isActive: req.path === '/wedding' },
            { title: 'Подарки', url: '/accessories', icon: '🎁', isActive: req.path === '/accessories' },
            { title: 'Акции', url: '/promo', icon: '🔥', isActive: req.path === '/promo' },
            { title: 'Контакты', url: '/contacts', icon: '📞', isActive: req.path === '/contacts' }
        ];
    }
    
    // Также добавляем меню в locals для обратной совместимости
    res.locals.menu = res.locals.nav;
    res.locals.categories = res.locals.nav;
    
    next();
};