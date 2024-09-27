const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');

router.post('/', sellerController.createSeller);

router.get('/', sellerController.getAllSellers);

router.get('/:id', sellerController.getSellerById);

router.patch('/:id', sellerController.updateSeller);

router.delete('/:id', sellerController.deleteSeller);

module.exports = router;
