const express = require('express');
const router = express.Router();
const touristController = require('../controllers/touristController');

router.post('/', touristController.createTourist);

router.get('/', touristController.getAllTourists);

router.get('/:id', touristController.getTouristById);

router.patch('/:id', touristController.updateTourist);

router.delete('/:id', touristController.deleteTourist);

// req11
router.patch('/touristUpdateProfile/:id', touristController.touristUpdateProfile); 
router.get('/touristReadProfile/:id', touristController.touristReadProfile);

// req50
router.post('/emailShare', touristController.emailShare)

// req 72
router.patch('/redeemPoints/:id', touristController.redeemPoints);

// req 40
router.get('/flights', touristController.bookFlight);

// req 61
router.delete('/:touristId/activity/:activityId/cancel', touristController.cancelActivityBooking);
router.delete('/:touristId/itinerary/:itineraryId/cancel', touristController.cancelItineraryBooking);

// req58 req71 req70
router.post('/:touristId/activity/:activityId/book', touristController.bookActivity);
router.post('/:touristId/itinerary/:itineraryId/book', touristController.bookItinerary);


module.exports = router;
