const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');
const uploadIdImage = require('../middleware/uploadImage');
const uploadTaxationRegCardImage = require('../middleware/uploadImage');
const uploadLogoImage = require('../middleware/uploadImage');
const validateEmail = require('../middleware/validateEmail');
const uniqueUsername = require("../middleware/uniqueUsername");



router.post('/', advertiserController.createAdvertiser);

router.get('/', advertiserController.getAllAdvertisers);

router.get('/:id', advertiserController.getAdvertiserById);

router.patch('/:id', advertiserController.updateAdvertiser);

router.delete('/deleteAgain/:id', advertiserController.deleteAdvertiser);

// req 16 ng
router.delete('/deleteAdvertisers', advertiserController.deleteAdvertisersRequestingDeletion);



//req5  -- Tatos
router.post('/guestAdvertiserCreateProfile',validateEmail, uniqueUsername, advertiserController.guestAdvertiserCreateProfile);    // Guest Advertiser sign up

// Create advertiser (sign-up)
//router.post('/addAdvertiserProfile', advertiserController.createAdvertiserProfile);

// Get the profile of the authenticated advertiser
router.get('/advertiserReadProfile/:id', advertiserController.advertiserReadProfile);

// Update the profile of the authenticated advertiser
router.patch('/advertiserUpdateProfile/:id',advertiserController.advertiserUpdateProfile);
router.post('/createAdvertiserProfile/:advertiserId',advertiserController.createAdvertiserProfile);


//----req26---
router.get('/getMyActivities/:advertiserId', advertiserController.getAdvertiserActivities);


router.delete('/deleteSomeAdvertisers', advertiserController.adminDeletesAdvertisers)


//delete off system
router.delete('/deleteAdvertiserFromSystem/:id', advertiserController.adminDeletesAdvertiserFromSystem);

router.patch('/acceptTerms/:id', advertiserController.acceptTerms);

module.exports = router;
