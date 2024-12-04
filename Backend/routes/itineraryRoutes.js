const express = require("express");
const router = express.Router();
const itineraryController = require("../controllers/itineraryController");
const uploadVenuePictures = require("../middleware/uploadVenuePictures");

router.post("/", itineraryController.createItinerary);

//req 33
router.patch("/hide/:id", itineraryController.hideItinerary);

router.patch("/unhide/:id", itineraryController.unhideItinerary);

router.get("/", itineraryController.getAllItineraries);

//get admin itin
router.get("/admin", itineraryController.getAdminItineraries);

//not hidden
router.get("/notHidden", itineraryController.getAllItinerariesNH);

router.get("/nothidden/orHasBookings/:id", itineraryController.getAllHasBookings);

//req44
router.get("/upcomingItineraries", itineraryController.getUpcomingItineraries);



router.get("/:id", itineraryController.getItineraryById);

router.get("/future/:id", itineraryController.getItineraryByIdF);


router.patch("/:id", itineraryController.updateItinerary);

router.delete("/:id", itineraryController.deleteItinerary);

// req37
router.get("/searchForThis/searchAgain", itineraryController.searchByName);

// req54 & req55
router.post(
  "/:touristId/itinerary/:itineraryId/feedback",
  itineraryController.giveItineraryFeedback
);

/*--req20--- 
params:name,
      timeline,
      language,
      price,
      availableDateTime,
      accessibility,
      pickUp,
      dropOff,
      maxTourists*/
router.post('/createSpecifiedItinerary/:guideId', uploadVenuePictures, itineraryController.createSpecifiedItinerary);
router.get('/readItinerariesOfGuide/:guideId', itineraryController.readItinerariesOfGuide);
router.patch('/updateItineraryFilteredFields/:guideId/:itineraryId', itineraryController.updateItineraryFilteredFields);
router.delete('/deleteSpecificItinerary/:guideId/:itineraryId', itineraryController.deleteSpecificItinerary);

//gets list of activities and venues that can be added to an itinerary
router.get('/fetchOptions/fetchOptions', itineraryController.fetchOptions);

// req39
//router.get("/preferrences/:id", itineraryController.getItinerariesByPreferences);

module.exports = router;
