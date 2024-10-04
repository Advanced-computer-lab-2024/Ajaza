const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.post("/", activityController.createActivity);

router.get("/", activityController.getAllActivities);

router.get("/group/byIds", activityController.getActivitiesByIds);

//req44
router.get("/upcomingActivities", activityController.getUpcomingActivities);

router.get("/:id", activityController.getActivityById);

router.patch("/:id", activityController.updateActivity);

router.delete("/:id", activityController.deleteActivity);

// req37
router.get(
  "/searchForThis/searchAgain",
  activityController.searchByNameCategoryTag
);

// req56 & req57
router.post(
  "/:touristId/activity/:activityId/feedback",
  activityController.giveActivityFeedback
);

// req42
router.get(
  "/transportation/transportationAgain",
  activityController.getTransportation
);
router.post(
  "/transportation/createTransportation/:id",
  activityController.createTransportation
);

// req19
router.post('/createSpecifiedActivity/:advertiserId', activityController.createSpecifiedActivity);
router.get('/readActivities/:advertiserId', activityController.readActivitiesOfAdvertiser);
router.delete('/deleteSpecificActivity/:advertiserId/:activityId', activityController.deleteSpecificActivity);
router.put('/updateActivityFilteredFields/:advertiser/:activityId', activityController.updateActivityFilteredFields);

module.exports = router;
