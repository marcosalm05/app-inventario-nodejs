const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();
//const productController = new ProductController();

//router.get('/search', productController.searchProduct);

router.get('/search', (req, res) => { res.render('search'); });

module.exports = router;