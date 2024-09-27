const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

router.post('/', itineraryController.createItinerary);

router.get('/', itineraryController.getAllItineraries);

router.get('/:id', itineraryController.getItineraryById);

router.patch('/:id', itineraryController.updateItinerary);

router.delete('/:id', itineraryController.deleteItinerary);

router.get('/search/:id', itineraryController.searchByName); // req37

router.post('/:touristId/itinerary/:itineraryId/feedback', touristController.giveItineraryFeedback);


module.exports = router;
