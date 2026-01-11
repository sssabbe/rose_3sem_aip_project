const { MongoClient } = require('mongodb');
var data = require("./data.js").data;

// Проверка данных
console.log("✅ Данные загружены успешно");
console.log("Количество цветов:", data.length);
data.forEach((flower, index) => {
    console.log(`${index + 1}. ${flower.title} (${flower.nick})`);
});

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'tc2024';

async function main() {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    
    // Можно использовать 'flowers' или 'cats' в зависимости от задания
    const collection = db.collection('flowers');

    // Вставляем данные
    const insertResult = await collection.insertMany(data);
    console.log('Inserted documents =>', insertResult);
    console.log(`Вставлено документов: ${insertResult.insertedCount}`);

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());