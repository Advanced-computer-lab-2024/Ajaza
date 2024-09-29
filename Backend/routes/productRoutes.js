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



//req86     // Admin/Seller add product     --Tatos
router.post('/:Id/product/adminSellerAddProduct',productController.adminSellerAddProduct);  //AdminSeller add product     

// router.post('/:adminId/product/adminSellerAddProduct', productController.adminSellerAddProduct); //Admin add product




//req88     // Admin/Seller Edit product      --Tatos
router.post('/:sellerId/product/:/productId/adminSellerEditProduct',productController.adminSellerEditProduct);  //Seller Edit product     

router.post('/:adminId/product/:/productId/adminSellerEditProduct', productController.adminSellerEditProduct); //Admin Edit product


module.exports = router;
