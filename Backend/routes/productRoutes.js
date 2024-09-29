const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.patch('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

// req102 req 103
router.post('/:touristId/products/:productId/feedback', productController.giveFeedback);



//req86     // Admin/Seller add product
router.post('/:sellerId/product/adminSellerAddProduct',productController.adminSellerAddProduct);  //Seller add product     

router.post('/:adminId/product/adminSellerAddProduct', productController.adminSellerAddProduct); //Admin add product






module.exports = router;
