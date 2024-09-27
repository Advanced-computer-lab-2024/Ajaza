const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

router.post('/', guideController.createGuide);

router.get('/', guideController.getAllGuides);

router.get('/:id', guideController.getGuideById);

router.patch('/:id', guideController.updateGuide);

router.delete('/:id', guideController.deleteGuide);

router.post('/:touristId/itinerary/:itineraryId/feedback', touristController.giveGuideFeedback);


module.exports = router;
