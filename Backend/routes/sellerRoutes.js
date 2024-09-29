const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

router.post('/', sellerController.createSeller);

router.get('/', sellerController.getAllSellers);

router.get('/:id', sellerController.getSellerById);

router.patch('/:id', sellerController.updateSeller);

router.delete('/:id', sellerController.deleteSeller);

// req6
router.post('/sellerCreateProfile', sellerController.sellerCreateProfile);    // Seller sign up
router.get('/sellerReadProfile/:id', sellerController.sellerReadProfile);    // Seller read profile
router.patch('/sellerUpdateProfile/:id', sellerController.sellerUpdateProfile);  // Seller update profile


module.exports = router;
