const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');

router.post('/', advertiserController.createAdvertiser);

router.get('/', advertiserController.getAllAdvertisers);

router.get('/:id', advertiserController.getAdvertiserById);

router.patch('/:id', advertiserController.updateAdvertiser);

router.delete('/deleteAgain/:id', advertiserController.deleteAdvertiser);

// req 16 ng
router.delete('/deleteAdvertisers', advertiserController.deleteAdvertisersRequestingDeletion);



//req5  -- Tatos
router.post('/guestAdvertiserCreateProfile', advertiserController.guestAdvertiserCreateProfile);    // Guest Advertiser sign up


module.exports = router;


