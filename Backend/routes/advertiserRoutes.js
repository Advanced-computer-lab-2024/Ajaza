const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');

router.post('/', advertiserController.createAdvertiser);

router.get('/', advertiserController.getAllAdvertisers);

router.get('/:id', advertiserController.getAdvertiserById);

router.patch('/:id', advertiserController.updateAdvertiser);

router.delete('/:id', advertiserController.deleteAdvertiser);

module.exports = router;