const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const uploadVenuePictures = require("../middleware/uploadVenuePictures");

router.post("/", activityController.createActivity);

//req 33
router.patch("/hide/:id", activityController.hideActivity);

router.patch("/unhide/:id", activityController.unhideActivity);

router.get("/", activityController.getAllActivities);

router.get("/nothidden/orHasBookings/:id", activityController.getAllHasBookings);

//admin activities
router.get("/admin", activityController.getAdminActivities);
//not hidden
router.get("/notHidden", activityController.getAllActivitiesNH);

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
router.post('/createSpecifiedActivity/:advertiserId', uploadVenuePictures, activityController.createSpecifiedActivity);
router.get('/readActivities/:advertiserId', activityController.readActivitiesOfAdvertiser);
router.delete('/deleteSpecificActivity/:advertiserId/:activityId', activityController.deleteSpecificActivity);
router.put('/updateActivityFilteredFields/:advertiserId/:activityId', activityController.updateActivityFilteredFields);

// req39
//router.get("/preferrences/:id", activityController.getActivitiesByPreferences);

router.post("/uploadPhotos/:activityId", uploadVenuePictures, activityController.uploadActivityPictures);


module.exports = router;
