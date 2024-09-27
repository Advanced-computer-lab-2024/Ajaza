const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.post('/', activityController.createActivity);

router.get('/', activityController.getAllActivities);

router.get('/:id', activityController.getActivityById);

router.patch('/:id', activityController.updateActivity);

router.delete('/:id', activityController.deleteActivity);

// req37
router.get('/searchForThis/searchAgain', activityController.searchByNameCategoryTag); 

//req56 & req57
router.post('/:touristId/activity/:activityId/feedback', activityController.giveActivityFeedback); 


module.exports = router;
