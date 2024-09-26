const express = require('express');
const router = express.Router();
const touristController = require('../controllers/touristController');

router.post('/', touristController.createTourist);

router.get('/', touristController.getAllTourists);

router.get('/:id', touristController.getTouristById);

router.patch('/:id', touristController.updateTourist);

router.delete('/:id', touristController.deleteTourist);

module.exports = router;
