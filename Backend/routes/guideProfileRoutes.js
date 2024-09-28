const express = require('express');
const router = express.Router();

const guideProfileController = require('../controllers/guideProfileController.js');
const authController = require('../controllers/authController.js'); // Assuming the JWT utility is here

// Create guide (sign-up)
router.post('/addGuide', guideProfileController.createGuide);

// Get the profile of the authenticated guide
router.get('/me', authController.verifyToken, guideProfileController.getGuideProfile);

// Update the profile of the authenticated guide
router.patch('/me', authController.verifyToken, guideProfileController.updateGuideProfile);

// Export the router using module.exports
module.exports = router;
