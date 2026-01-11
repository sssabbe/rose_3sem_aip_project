const { MongoClient } = require('mongodb');
var data = require("./data.js").data;

// Выводим данные в консоль для проверки
console.log("Данные из data.js:");
console.log("Количество цветов:", data.length);
data.forEach((flower, index) => {
    console.log(`${index + 1}. ${flower.title} (${flower.nick})`);
});
console.log("---");

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'flowerShop';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('flowers');

    // Преобразуем данные для MongoDB
    const flowersData = data.map(flower => ({
        title: flower.title,
        nick: flower.nick,
        avatar: flower.avatar,
        description: flower.desc,
        category: getCategory(flower.nick),
        price: getPrice(flower.nick),
        createdAt: new Date(),
        updatedAt: new Date()
    }));

    // Удаляем старые данные
    await collection.deleteMany({});
    console.log('Old data cleared');

    // Вставляем новые данные
    const insertResult = await collection.insertMany(flowersData);
    console.log(`Inserted ${insertResult.insertedCount} flowers`);

    // Показываем результат
    const allFlowers = await collection.find({}).toArray();
    console.log('Total in database:', allFlowers.length);

    // Создаем индексы
    await collection.createIndex({ nick: 1 }, { unique: true });
    await collection.createIndex({ category: 1 });
    
    console.log('Database indexes created');

    return 'Database populated successfully!';
}

// Вспомогательные функции для категорий и цен
function getCategory(nick) {
    const categories = {
        'red_rose': 'roses',
        'pink_rose': 'roses',
        'exotic_flower': 'unusual',
        'wedding_bouquet': 'wedding',
        'white_lily': 'unusual',
        'daisy_field': 'field'
    };
    return categories[nick] || 'other';
}

function getPrice(nick) {
    const prices = {
        'red_rose': 650,
        'pink_rose': 550,
        'exotic_flower': 1200,
        'wedding_bouquet': 4500,
        'white_lily': 800,
        'daisy_field': 400
    };
    return prices[nick] || 500;
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());