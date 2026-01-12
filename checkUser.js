var mongoose = require('mongoose');

// Подключаемся к базе данных (БЕЗ устаревших опций)
mongoose.connect('mongodb://localhost:27017/flowerShop2024');

mongoose.connection.on('connected', function() {
    console.log('✅ Подключено к MongoDB');
});

mongoose.connection.on('error', function(err) {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    console.log('\n📌 Возможные решения для macOS:');
    console.log('1. Установите MongoDB: brew install mongodb-community');
    console.log('2. Запустите: brew services start mongodb-community');
    console.log('3. Или запустите вручную: mongod --config /usr/local/etc/mongod.conf');
    console.log('4. Проверьте: mongo --host localhost:27017');
    process.exit(1);
});

// Подключаем модель пользователя
var User = require('./models/user');

// Функция для тестирования
async function testUserModel() {
    try {
        console.log('🧪 Начинаем тестирование модели User...\n');
        
        // 1. Очищаем старые данные (опционально)
        console.log('1. Очищаем старые данные...');
        await User.deleteMany({});
        console.log('✅ База очищена');
        
        // 2. Создаем первого пользователя
        console.log('\n2. Создаем первого пользователя...');
        var firstUser = new User({
            username: 'Vasya',
            password: 'qwerty123',
            email: 'vasya@example.com',
            fullName: 'Василий Петров'
        });
        
        await firstUser.save();
        console.log('✅ Первый пользователь создан:', firstUser.username);
        
        // 3. Создаем второго пользователя
        console.log('\n3. Создаем второго пользователя...');
        var secondUser = new User({
            username: 'admin',
            password: 'admin123',
            email: 'admin@flowershop.ru',
            fullName: 'Администратор',
            role: 'admin'
        });
        
        await secondUser.save();
        console.log('✅ Второй пользователь создан:', secondUser.username);
        
        // 4. Проверяем аутентификацию
        console.log('\n4. Проверяем аутентификацию...');
        var foundUser = await User.findOne({ username: 'Vasya' });
        
        if (foundUser) {
            console.log('✅ Пользователь найден:', foundUser.username);
            
            // Проверяем пароль
            var isPasswordCorrect = foundUser.checkPassword('qwerty123');
            console.log('✅ Проверка пароля "qwerty123":', isPasswordCorrect ? 'Правильный' : 'Неправильный');
            
            var isWrongPassword = foundUser.checkPassword('wrongpassword');
            console.log('✅ Проверка пароля "wrongpassword":', isWrongPassword ? 'Правильный' : 'Неправильный');
            
            // Получаем безопасные данные
            var safeData = foundUser.getSafeData();
            console.log('✅ Безопасные данные пользователя:');
            console.log(safeData);
        }
        
        // 5. Поиск пользователя по логину
        console.log('\n5. Ищем пользователя по email...');
        var userByLogin = await User.findByUsernameOrEmail('vasya@example.com');
        if (userByLogin) {
            console.log('✅ Пользователь найден по email:', userByLogin.username);
        }
        
        // 6. Обновляем время последнего входа
        console.log('\n6. Обновляем время последнего входа...');
        await foundUser.updateLastLogin();
        console.log('✅ Время последнего входа обновлено');
        
        // 7. Проверяем уникальность
        console.log('\n7. Проверяем уникальность...');
        try {
            var duplicateUser = new User({
                username: 'Vasya', // Дубликат
                password: 'test123',
                email: 'test@example.com',
                fullName: 'Тестовый пользователь'
            });
            
            await duplicateUser.save();
            console.log('❌ ОШИБКА: Дубликат должен быть отклонен');
        } catch (error) {
            console.log('✅ Правильно отклонен дубликат:', error.message);
        }
        
        // 8. Выводим всех пользователей
        console.log('\n8. Все пользователи в базе:');
        var allUsers = await User.find({}).select('username email role created');
        allUsers.forEach(function(user, index) {
            console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.role} - ${user.created.toLocaleString()}`);
        });
        
        console.log('\n✅ Тестирование завершено успешно!');
        
    } catch (error) {
        console.error('❌ Ошибка при тестировании:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        // Закрываем соединение
        await mongoose.connection.close();
        console.log('\n📡 Соединение с базой данных закрыто');
    }
}

// Запускаем тестирование
testUserModel();