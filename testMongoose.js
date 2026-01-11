const mongoose = require('mongoose');

// Подключаемся к базе (можно использовать вашу tc2024 или новую)
mongoose.connect('mongodb://127.0.0.1:27017/testMongoose2024');

// Создаем схему для цветка (аналогично схеме для кота)
var schema = mongoose.Schema({ 
    name: String,
    type: String,
    price: Number
});

// Добавляем метод к схеме (как в примере с meow)
schema.methods.bloom = function() {
    console.log(this.name + " расцвел и стоит " + this.price + " рублей");
}

// Создаем модель Flower на основе схемы
const Flower = mongoose.model('Flower', schema);

// Создаем новый цветок
const rose = new Flower({ 
    name: 'Алая роза',
    type: 'rose',
    price: 650
});

// Сохраняем и вызываем метод
rose.save()
    .then(() => {
        console.log('✅ Цветок сохранен в базу данных');
        rose.bloom(); // Вызываем наш метод
    })
    .catch(error => {
        console.error('❌ Ошибка:', error);
    })
    .finally(() => {
        // Закрываем соединение
        mongoose.connection.close();
        console.log('🔌 Соединение закрыто');
    });