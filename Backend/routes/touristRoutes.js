const express = require('express');
const router = express.Router();
const touristController = require('../controllers/touristController');
const apiController = require('../controllers/apiController');

const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

router.post('/', touristController.createTourist);

router.get('/', touristController.getAllTourists);

router.get('/:id', touristController.getTouristById);

router.patch('/:id', touristController.updateTourist);

router.delete('/:id', touristController.deleteTourist);

// req11
router.patch('/touristUpdateProfile/:id', touristController.touristUpdateProfile); 
router.get('/touristReadProfile/:id', touristController.touristReadProfile);

// req50
router.post('/emailShare/:id', touristController.emailShare)

// req72
router.patch('/redeemPoints/:id', touristController.redeemPoints);

// req40
router.get('/flights/searchFlights', apiController.searchFlights);
//router.post('/flights/bookFlight', apiController.bookFlight);
// req41
//router.get('/hotels/searchHotels', apiController.searchHotels);
//router.post('/hotels/bookHotel', apiController.bookHotel);

// req61
router.delete('/:touristId/activity/:activityId/cancel', touristController.cancelActivityBooking);
router.delete('/:touristId/itinerary/:itineraryId/cancel', touristController.cancelItineraryBooking);

// req58 req71 req70
router.post('/:touristId/activity/:activityId/book', touristController.bookActivity);
router.post('/:touristId/itinerary/:itineraryId/book', touristController.bookItinerary);




//req4      --Tatos
router.post('/guestTouristCreateProfile', touristController.guestTouristCreateProfile);    // Guest Tourist sign up







module.exports = router;
