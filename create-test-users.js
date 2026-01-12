const mongoose = require('mongoose');
const User = require('./models/user');

async function createTestUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/flowerShop2024');
        console.log('✅ Подключено к MongoDB');
        
        // Очищаем старых пользователей
        await User.deleteMany({});
        console.log('🗑️  Старые пользователи удалены');
        
        // Создаем администратора
        const admin = new User({
            username: 'admin',
            password: 'admin123',
            email: 'admin@flowershop.ru',
            fullName: 'Администратор Системы',
            role: 'admin'
        });
        await admin.save();
        console.log('👑 Администратор создан: admin / admin123');
        
        // Создаем обычного пользователя
        const user = new User({
            username: 'user',
            password: 'user123',
            email: 'user@flowershop.ru',
            fullName: 'Обычный Пользователь',
            role: 'user'
        });
        await user.save();
        console.log('👤 Пользователь создан: user / user123');
        
        // Создаем тестового пользователя
        const test = new User({
            username: 'test',
            password: 'test123',
            email: 'test@flowershop.ru',
            fullName: 'Тестовый Пользователь',
            role: 'user'
        });
        await test.save();
        console.log('🧪 Тестовый пользователь создан: test / test123');
        
        console.log('\n🎉 Тестовые пользователи созданы!');
        console.log('\n📋 Тестовые данные для входа:');
        console.log('1. Администратор: admin / admin123');
        console.log('2. Пользователь: user / user123');
        console.log('3. Тестовый: test / test123');
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n📡 Соединение закрыто');
    }
}

createTestUsers();