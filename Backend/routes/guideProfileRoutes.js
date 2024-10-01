const express = require('express');
const router = express.Router();
const { createGuide, getGuideProfile, updateGuideProfile } = require('../controllers/guideProfileController');

// Define routes
router.post('/addGuide', createGuide);
router.get('/getGuideProfile', getGuideProfile);
router.put('/updateGuideProfile', updateGuideProfile);

module.exports = router;
