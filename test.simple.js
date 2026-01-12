console.log('🧪 Тест импорта модели User\n');

try {
    console.log('1. Пытаемся загрузить модель...');
    
    // Способ 1: как в createUser.js
    console.log('\nСпособ 1: require("./models/user").User');
    try {
        const User1 = require("./models/user").User;
        console.log('✅ Успешно!');
        console.log('   Тип User1:', typeof User1);
        console.log('   Это функция?:', typeof User1 === 'function');
    } catch (err1) {
        console.log('❌ Ошибка:', err1.message);
    }
    
    // Способ 2: прямой импорт
    console.log('\nСпособ 2: const model = require("./models/user")');
    try {
        const model = require("./models/user");
        console.log('✅ Успешно!');
        console.log('   Тип model:', typeof model);
        console.log('   Ключи:', Object.keys(model));
        console.log('   Есть User?:', 'User' in model);
    } catch (err2) {
        console.log('❌ Ошибка:', err2.message);
    }
    
    console.log('\n2. Проверяем пути...');
    const fs = require('fs');
    const path = require('path');
    
    const files = [
        './models/user.js',
        './middlewares/createUser.js',
        './middlewares/createMenu.js',
        './app.js'
    ];
    
    files.forEach(file => {
        const exists = fs.existsSync(path.resolve(file));
        console.log(`   ${exists ? '✅' : '❌'} ${file} - ${exists ? 'существует' : 'не найден'}`);
    });
    
} catch (error) {
    console.error('💥 Критическая ошибка:', error);
}