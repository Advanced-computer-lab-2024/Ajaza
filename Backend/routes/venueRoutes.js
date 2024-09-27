const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

router.post('/', venueController.createVenue);

router.get('/', venueController.getAllVenues);

router.get('/:id', venueController.getVenueById);

// tags
router.patch('/:id', venueController.updateVenue);

router.delete('/:id', venueController.deleteVenue);

// req37
router.get('/searchForThis/searchAgain', venueController.searchByNameTag);

module.exports = router;
