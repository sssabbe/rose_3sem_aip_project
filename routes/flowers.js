const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Главная страница цветов
router.get('/', async (req, res, next) => {
  try {
    const flowers = await Product.find({ 
      category: 'flower', 
      inStock: true 
    }).sort({ name: 1 }); // По алфавиту
    
    // Группировка по типам (тегам)
    const flowersByType = {};
    flowers.forEach(flower => {
      if (flower.tags && flower.tags.length > 0) {
        const type = flower.tags[0]; // Первый тег как тип
        if (!flowersByType[type]) {
          flowersByType[type] = [];
        }
        flowersByType[type].push(flower);
      } else {
        if (!flowersByType['Другие']) {
          flowersByType['Другие'] = [];
        }
        flowersByType['Другие'].push(flower);
      }
    });
    
    res.render('flowers', { 
      title: 'Цветы - Цветочный магазин',
      pageTitle: 'Срезанные цветы',
      products: flowers,
      groupedProducts: flowersByType,
      category: 'flower'
    });
  } catch (err) {
    next(err);
  }
});

// Страница отдельного цветка
router.get('/:id', async (req, res, next) => {
  try {
    const flower = await Product.findById(req.params.id);
    
    if (!flower || flower.category !== 'flower') {
      return next(createError(404, 'Цветок не найден'));
    }
    
    res.render('product-detail', {
      title: `${flower.name} - Цветок`,
      pageTitle: flower.name,
      product: flower,
      category: 'flower'
    });
  } catch (err) {
    next(err);
  }
});

// Страница по типу цветка
router.get('/type/:type', async (req, res, next) => {
  try {
    const flowers = await Product.find({ 
      category: 'flower', 
      inStock: true,
      tags: req.params.type
    });
    
    res.render('flowers-type', {
      title: `${req.params.type} - Цветы`,
      pageTitle: `${req.params.type}`,
      products: flowers,
      flowerType: req.params.type,
      category: 'flower'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;