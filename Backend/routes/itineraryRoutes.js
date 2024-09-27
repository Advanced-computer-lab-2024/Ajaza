const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

router.post('/', itineraryController.createItinerary);

router.get('/', itineraryController.getAllItineraries);

router.get('/:id', itineraryController.getItineraryById);

router.patch('/:id', itineraryController.updateItinerary);

router.delete('/:id', itineraryController.deleteItinerary);

module.exports = router;
