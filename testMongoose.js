
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/tc2024');


const Flower = mongoose.model('Flower', { 
    title: String,
    nick: String,
    avatar: String,
    desc: String 
});


const newFlower = new Flower({ 
    title: 'Розовый тюльпан',
    nick: 'pink_tulip',
    avatar: '/images/tulip.jpg',
    desc: 'Нежный розовый тюльпан весеннего цветения' 
});


newFlower.save()
    .then(() => {
        console.log('✅ Цветок сохранен в базу tc2024');
        console.log('Название:', newFlower.title);
        console.log('Ник:', newFlower.nick);
        console.log('Описание:', newFlower.desc);
        
        // Можно добавить дополнительную проверку
        return Flower.find();
    })
    .then(flowers => {
        console.log('\n📊 Всего цветов в базе:', flowers.length);
        console.log('Цветы в базе:');
        flowers.forEach(flower => {
            console.log(`- ${flower.title} (${flower.nick})`);
        });
        
        // Закрываем соединение
        mongoose.connection.close();
        console.log('\n🔌 Соединение с MongoDB закрыто');
    })
    .catch(error => {
        console.error('❌ Ошибка сохранения:', error.message);
        mongoose.connection.close();
    });