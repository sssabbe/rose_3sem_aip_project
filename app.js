const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // ← ДОБАВЬТЕ ЭТО
const path = require('path');

const app = express();

// НАСТРОЙКИ - ВАЖНЫЙ ПОРЯДОК:
// 1. Сначала cookie-parser
app.use(cookieParser());

// 2. Потом session
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 24 часа
    }
}));

// 3. Потом парсеры тела запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// 5. Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ПРОСТОЙ middleware
app.use(function(req, res, next) {
    console.log(`📝 Запрос: ${req.method} ${req.path}`);
    console.log('🍪 Куки:', req.cookies);
    console.log('🔐 Сессия:', req.session);
    
    // Инициализируем переменные с проверкой на undefined
    res.locals.visitCount = 1; // значение по умолчанию
    res.locals.lastVisit = 'первый раз';
    
    // Проверяем куки - ТЕПЕРЬ БЕЗОПАСНО
    if (req.cookies) {
        let visitCount = parseInt(req.cookies.visitCount) || 0;
        visitCount++;
        
        // Устанавливаем куки
        res.cookie('visitCount', visitCount, { 
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true 
        });
        
        res.cookie('lastVisit', new Date().toLocaleString('ru-RU'), { 
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true 
        });
        
        // Передаем в шаблон
        res.locals.visitCount = visitCount;
        res.locals.lastVisit = req.cookies.lastVisit || 'первый раз';
    }
    
    // Простое меню
    res.locals.nav = [
        { title: 'Главная', url: '/', isActive: req.path === '/' },
        { title: 'Войти', url: '/auth/login', isActive: req.path === '/auth/login' },
        { title: 'Регистрация', url: '/auth/register', isActive: req.path === '/auth/register' }
    ];
    
    // Простой пользователь
    res.locals.user = null;
    res.locals.currentUser = null;
    res.locals.isAuthenticated = false;
    res.locals.isAdmin = false;
    res.locals.userName = 'Гость';
    
    // Счетчик сессии с проверкой
    if (req.session) {
        if (!req.session.visitCount) req.session.visitCount = 0;
        req.session.visitCount++;
        res.locals.sessionCounter = req.session.visitCount;
        res.locals.lastRequest = new Date().toLocaleString('ru-RU');
        res.locals.firstVisit = req.session.firstVisit || new Date().toLocaleString('ru-RU');
        res.locals.sessionID = req.sessionID || 'no-session';
    } else {
        res.locals.sessionCounter = 0;
        res.locals.lastRequest = 'нет сессии';
        res.locals.firstVisit = 'нет сессии';
        res.locals.sessionID = 'no-session';
    }
    
    // Корзина
    res.locals.cartItemCount = 0;
    
    next();
});

// Простые маршруты
app.get('/', (req, res) => {
    console.log('📊 Данные для шаблона:');
    console.log('  visitCount:', res.locals.visitCount);
    console.log('  sessionCounter:', res.locals.sessionCounter);
    console.log('  isAuthenticated:', res.locals.isAuthenticated);
    
    res.render('index', { 
        title: 'Главная',
        message: 'Добро пожаловать в цветочный магазин!',
        // Дублируем ключевые переменные для надежности
        visitCount: res.locals.visitCount || 1,
        lastVisit: res.locals.lastVisit || 'первый раз',
        sessionCounter: res.locals.sessionCounter || 1,
        lastRequest: res.locals.lastRequest || 'только что',
        firstVisit: res.locals.firstVisit || 'только что',
        sessionID: res.locals.sessionID || 'no-id',
        isAuthenticated: res.locals.isAuthenticated || false,
        userName: res.locals.userName || 'Гость',
        nav: res.locals.nav || [],
        // Каталоги (если используются)
        roses: [],
        bouquets: [],
        // Корзина
        cart: { items: [], total: 0, itemCount: 0 }
    });
});

app.get('/auth/login', (req, res) => {
    res.render('auth/login', { 
        title: 'Вход в систему',
        error: null,
        success: null
    });
});

app.post('/auth/login', (req, res) => {
    // Простая имитация входа
    if (req.session) {
        req.session.userId = '12345';
        req.session.username = 'testuser';
        req.session.user = {
            id: '12345',
            username: 'testuser',
            role: 'user'
        };
        req.session.success = 'Вы успешно вошли!';
    }
    
    res.redirect('/');
});

app.get('/auth/register', (req, res) => {
    res.render('auth/register', { 
        title: 'Регистрация',
        error: null,
        success: null
    });
});

// Выход
app.get('/auth/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
    }
    res.redirect('/');
});

// Обработка 404
app.use(function(req, res, next) {
    res.status(404).send('Страница не найдена');
});

// Обработка ошибок
app.use(function(err, req, res, next) {
    console.error('💥 Ошибка сервера:', err);
    res.status(500).send('Произошла ошибка сервера');
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
    console.log(`📁 Директория: ${__dirname}`);
    console.log(`⚠️  Установите cookie-parser: npm install cookie-parser`);
});