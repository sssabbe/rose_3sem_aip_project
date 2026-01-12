module.exports = function(req, res, next) {
    // Создаем простое меню
    const nav = [
        {
            title: 'Главная',
            url: '/',
            icon: '<i class="fas fa-home"></i>',
            isActive: req.path === '/'
        },
        {
            title: 'Войти',
            url: '/auth/login',
            icon: '<i class="fas fa-sign-in-alt"></i>',
            isActive: req.path === '/auth/login'
        },
        {
            title: 'Регистрация',
            url: '/auth/register',
            icon: '<i class="fas fa-user-plus"></i>',
            isActive: req.path === '/auth/register'
        }
    ];
    
    // Добавляем меню
    res.locals.nav = nav;
    res.locals.currentPath = req.path;
    
    next();
};