// testMongooseSimple.js - простая версия как в документации
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tc2024');

// По аналогии с "Cat", но для цветов
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

newFlower.save().then(() => {
    console.log('✅ Цветок сохранен:', newFlower.title);
    console.log('📝 Описание:', newFlower.desc);
    mongoose.connection.close();
});