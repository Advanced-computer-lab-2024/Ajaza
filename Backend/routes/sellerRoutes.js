const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const uploadIdImage = require('../middleware/uploadImage');
const uploadTaxationRegCardImage = require('../middleware/uploadImage');
const uploadLogoImage = require('../middleware/uploadImage');
const validateEmail = require('../middleware/validateEmail');
const uniqueUsername = require("../middleware/uniqueUsername");



router.post('/', sellerController.createSeller);

router.get('/', sellerController.getAllSellers);

router.get('/:id', sellerController.getSellerById);

router.patch('/:id', sellerController.updateSeller);

router.delete('/deleteAgain/:id', sellerController.deleteSeller);
//req 16 ng
router.delete('/deleteSellers', sellerController.deleteSellersRequestingDeletion);

//req5
router.post('/guestSellerCreateProfile', validateEmail, uniqueUsername, sellerController.guestSellerCreateProfile);    // Guest Seller sign up

// req9
router.post('/sellerCreateProfile/:id', sellerController.sellerCreateProfile);    // Seller sign up
router.get('/sellerReadProfile/:id', sellerController.sellerReadProfile);    // Seller read profile
router.patch('/sellerUpdateProfile/:id', validateEmail, sellerController.sellerUpdateProfile);  // Seller update profile
router.delete('/sellerDeleteHimself/:id',sellerController.sellerDeleteHimself);  // Seller delete himself


router.delete('/deleteSomeSellers', sellerController.adminDeletesSellers);

module.exports = router;
