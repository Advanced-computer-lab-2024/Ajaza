const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const uploadIdImage = require('../middleware/uploadImage');
const uploadTaxationRegCardImage = require('../middleware/uploadImage');
const uploadLogoImage = require('../middleware/uploadImage');


router.post('/', sellerController.createSeller);

router.get('/', sellerController.getAllSellers);

router.get('/:id', sellerController.getSellerById);

router.patch('/:id', sellerController.updateSeller);

router.delete('/deleteAgain/:id', sellerController.deleteSeller);
//req 16 ng
router.delete('/deleteSellers', sellerController.deleteSellersRequestingDeletion);

//req5
router.post('/guestSellerCreateProfile', sellerController.guestSellerCreateProfile);    // Guest Seller sign up

// req9
router.post('/sellerCreateProfile', sellerController.sellerCreateProfile);    // Seller sign up
router.get('/sellerReadProfile/:id', sellerController.sellerReadProfile);    // Seller read profile
router.patch('/sellerUpdateProfile/:id', sellerController.sellerUpdateProfile);  // Seller update profile


module.exports = router;
