const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');

router.post('/', promoCodeController.createPromoCode);

router.get('/', promoCodeController.getAllPromoCodes);

router.get('/:id', promoCodeController.getPromoCodeById);

// this will probably not be used
router.patch('/:id', promoCodeController.updatePromoCode);

router.delete('/:id', promoCodeController.deletePromoCode);

router.post("/checkValid/:code", promoCodeController.checkValid);

module.exports = router;
