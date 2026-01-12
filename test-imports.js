console.log('🔍 Проверка импортов...\n');

try {
    // 1. Проверяем модель User
    console.log('1. Загружаем модель User...');
    const userModel = require('./bin/models/user');
    console.log('✅ Модель User загружена успешно');
    console.log('   Экспорт:', Object.keys(userModel));
    console.log('   User:', userModel.User ? 'есть' : 'нет');
    
    // 2. Проверяем createUser middleware
    console.log('\n2. Загружаем createUser middleware...');
    const createUser = require('./bin/middlewares/createUser');
    console.log('✅ Middleware createUser загружен успешно');
    console.log('   Тип:', typeof createUser);
    
    // 3. Проверяем createMenu middleware
    console.log('\n3. Загружаем createMenu middleware...');
    const createMenu = require('./bin/middlewares/createMenu');
    console.log('✅ Middleware createMenu загружен успешно');
    
    // 4. Проверяем роутер auth
    console.log('\n4. Загружаем auth роутер...');
    const authRouter = require('./public/routes/auth');
    console.log('✅ Auth роутер загружен успешно');
    
    console.log('\n🎉 Все импорты работают корректно!');
    
} catch (error) {
    console.error('\n❌ Ошибка при импорте:', error.message);
    console.error('Полный стек:');
    console.error(error.stack);
    
    // Проверяем существование файлов
    const fs = require('fs');
    const path = require('path');
    
    const filesToCheck = [
        './bin/models/user.js',
        './bin/middlewares/createUser.js',
        './bin/middlewares/createMenu.js',
        './public/routes/auth.js'
    ];
    
    console.log('\n📁 Проверка существования файлов:');
    filesToCheck.forEach(file => {
        const exists = fs.existsSync(path.resolve(file));
        console.log(`   ${file}: ${exists ? '✅ существует' : '❌ не найден'}`);
    });
}