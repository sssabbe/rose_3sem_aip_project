const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Главная страница аксессуаров
router.get('/', async (req, res, next) => {
  try {
    const accessories = await Product.find({ 
      category: 'accessory', 
      inStock: true 
    }).sort({ price: 1 }); // От дешевых к дорогим
    
    res.render('accessories', { 
      title: 'Аксессуары - Цветочный магазин',
      pageTitle: 'Аксессуары для цветов',
      products: accessories,
      category: 'accessory'
    });
  } catch (err) {
    next(err);
  }
});

// Страница отдельного аксессуара
router.get('/:id', async (req, res, next) => {
  try {
    const accessory = await Product.findById(req.params.id);
    
    if (!accessory || accessory.category !== 'accessory') {
      return next(createError(404, 'Аксессуар не найден'));
    }
    
    // Показываем букеты, которые могут сочетаться с этим аксессуаром
    const matchingBouquets = await Product.find({
      category: 'bouquet',
      inStock: true,
      tags: { $in: accessory.tags || [] }
    }).limit(2);
    
    res.render('product-detail', {
      title: `${accessory.name} - Аксессуар`,
      pageTitle: accessory.name,
      product: accessory,
      matchingProducts: matchingBouquets,
      category: 'accessory'
    });
  } catch (err) {
    next(err);
  }
});

// Аксессуары по типу
router.get('/category/:type', async (req, res, next) => {
  try {
    const types = {
      'vases': 'Вазы',
      'ribbons': 'Ленты и банты',
      'pots': 'Горшки',
      'cards': 'Открытки',
      'packaging': 'Упаковка'
    };
    
    const typeName = types[req.params.type] || req.params.type;
    const accessories = await Product.find({ 
      category: 'accessory', 
      inStock: true,
      tags: typeName
    });
    
    res.render('accessories-category', {
      title: `${typeName} - Аксессуары`,
      pageTitle: typeName,
      products: accessories,
      categoryName: typeName,
      category: 'accessory'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;