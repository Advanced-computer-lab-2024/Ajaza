const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');
const uploadPhotoImage = require('../middleware/uploadPhotoImage');

router.post("/", productController.createProduct);
//req81
router.get("/", productController.getAllProducts);


//all
router.get("/all", productController.getAllProductsEH);
//req83
router.get("/search", productController.searchProduct);

router.get("/:id", productController.getProductById);

router.patch("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

// req102 req 103
router.post(
  "/:touristId/products/:productId/feedback",
  productController.giveFeedback
);

//req86     // Admin/Seller add product     --Tatos
router.post("/:id/product/adminSellerAddProduct", uploadPhotoImage, productController.adminSellerAddProduct); //AdminSeller add product

//req88     // Admin/Seller Edit product      --Tatos
router.patch("/:id/product/:productId/adminSellerEditProduct",productController.adminSellerEditProduct); //AdminSeller Edit product

// get my products admin/seller
router.get("/viewMyProducts/:id", productController.viewMyProducts);
module.exports = router;
