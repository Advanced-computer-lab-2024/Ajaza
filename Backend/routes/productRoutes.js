const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/", productController.createProduct);

router.get("/", productController.getAllProducts);
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
router.post(
  "/:id/product/adminSellerAddProduct",
  productController.adminSellerAddProduct
); //AdminSeller add product

//req88     // Admin/Seller Edit product      --Tatos
router.patch(
  "/:id/product/:productId/adminSellerEditProduct",
  productController.adminSellerEditProduct
); //AdminSeller Edit product

module.exports = router;
