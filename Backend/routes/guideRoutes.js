const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

router.post('/', guideController.createGuide);

router.get('/', guideController.getAllGuides);

router.get('/:id', guideController.getGuideById);

router.patch('/:id', guideController.updateGuide);

router.delete('/:id', guideController.deleteGuide);

// req52 & req53
router.post('/:touristId/guide/:itineraryId/feedback', guideController.giveGuideFeedback);




//req5  -- Tatos
router.post('/guestGuideCreateProfile', guideController.guestGuideCreateProfile);    // Guest Guide sign up







module.exports = router;
