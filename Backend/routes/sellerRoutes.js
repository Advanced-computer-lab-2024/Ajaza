const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const uploadIdTaxImage = require('../middleware/uploadIdTaxImage');
const uploadLogoImage = require('../middleware/uploadLogoImage');
const validateEmail = require('../middleware/validateEmail');
const uniqueEmail = require('../middleware/uniqueEmail');
const uniqueUsername = require("../middleware/uniqueUsername");



router.post('/', sellerController.createSeller);

router.get('/', sellerController.getAllSellers);

router.get('/:id', sellerController.getSellerById);

router.patch('/:id', sellerController.updateSeller);

router.delete('/deleteAgain/:id', sellerController.deleteSeller);
//req 16 ng
router.delete('/deleteSellers', sellerController.deleteSellersRequestingDeletion);

//req5
router.post('/guestSellerCreateProfile', validateEmail, uniqueEmail, uniqueUsername, uploadIdTaxImage, sellerController.guestSellerCreateProfile);    // Guest Seller sign up

// req9
router.post('/sellerCreateProfile/:id', sellerController.sellerCreateProfile);    // Seller sign up
router.get('/sellerReadProfile/:id', sellerController.sellerReadProfile);    // Seller read profile
router.patch('/sellerUpdateProfile/:id', validateEmail, uniqueEmail,uploadLogoImage, sellerController.sellerUpdateProfile);  // Seller update profile
router.delete('/sellerDeleteHimself/:id',sellerController.sellerDeleteHimself);  // Seller delete himself


router.delete('/deleteSomeSellers', sellerController.adminDeletesSellers);


//delete off system
router.delete('/deleteSellerFromSystem/:id', sellerController.adminDeletesSellerFromSystem);

router.patch('/acceptTerms/:id', sellerController.acceptTerms);

router.post("/uploadLogo/:sellerId", uploadLogoImage, sellerController.uploadSellerLogo);

//for admin to view uploaded documents of a seller
router.get('/getDocuments/:id', sellerController.getSellerDocuments);

//accept seller
router.put('/accept/:id', sellerController.acceptSeller);

//reject seller
router.delete('/reject/:id', sellerController.rejectSeller);

module.exports = router;
