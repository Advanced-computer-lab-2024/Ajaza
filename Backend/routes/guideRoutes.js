const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const uploadPhotoImage = require('../middleware/uploadImage');
const validateEmail = require('../middleware/validateEmail');
const uniqueUsername = require("../middleware/uniqueUsername");


router.post('/', guideController.createGuide);

router.get('/', guideController.getAllGuides);

router.get('/:id', guideController.getGuideById);

router.patch('/:id', guideController.updateGuide);

router.delete('/deleteAgain/:id', guideController.deleteGuide);

//req 16 ng
router.delete('/deleteGuides', guideController.deleteGuidesRequestingDeletion);

// req52 & req53
router.post('/:touristId/guide/:itineraryId/feedback', guideController.giveGuideFeedback);
//req 7 
router.post('/addGuide/:guideId', guideController.createGuideProfile);
router.get('/getGuideProfile/:id', guideController.getGuideProfile);
router.put('/updateGuideProfile/:id', guideController.updateGuideProfile);



//req5  -- Tatos
router.post('/guestGuideCreateProfile',validateEmail,uniqueUsername, guideController.guestGuideCreateProfile);    // Guest Guide sign up

//req 26
router.get('/getMyItineraries/:guideId', guideController.getGuideItineraries);


router.delete('/deleteSomeGuides', guideController.adminDeletesGuides);


//delete off system
router.delete('/deleteGuideFromSystem/:id', guideController.adminDeletesGuideFromSystem);

router.patch('/acceptTerms/:id', guideController.acceptTerms);




module.exports = router;
