const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Главная страница букетов
router.get('/', async (req, res, next) => {
  try {
    const bouquets = await Product.find({ 
      category: 'bouquet', 
      inStock: true 
    }).sort({ createdAt: -1 }); // Сначала новые
    
    res.render('bouquets', { 
      title: 'Букеты - Цветочный магазин',
      pageTitle: 'Наши букеты',
      products: bouquets,
      category: 'bouquet'
    });
  } catch (err) {
    next(err);
  }
});

// Страница отдельного букета
router.get('/:id', async (req, res, next) => {
  try {
    const bouquet = await Product.findById(req.params.id);
    
    if (!bouquet || bouquet.category !== 'bouquet') {
      return next(createError(404, 'Букет не найден'));
    }
    
    // Похожие товары (другие букеты)
    const related = await Product.find({
      category: 'bouquet',
      inStock: true,
      _id: { $ne: bouquet._id } // исключаем текущий товар
    }).limit(3);
    
    res.render('product-detail', {
      title: `${bouquet.name} - Букет`,
      pageTitle: bouquet.name,
      product: bouquet,
      related: related,
      category: 'bouquet'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;