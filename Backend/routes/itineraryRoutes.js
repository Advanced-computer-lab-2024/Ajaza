const express = require("express");
const router = express.Router();
const itineraryController = require("../controllers/itineraryController");

router.post("/", itineraryController.createItinerary);

router.get("/", itineraryController.getAllItineraries);
//not hidden
router.get("/notHidden", itineraryController.getAllItinerariesNH);
//req44
router.get("/upcomingItineraries", itineraryController.getUpcomingItineraries);

router.get("/:id", itineraryController.getItineraryById);

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
router.post('/createSpecifiedItinerary/:guideId', itineraryController.createSpecifiedItinerary);
router.get('/readItinerariesOfGuide/:guideId', itineraryController.readItinerariesOfGuide);
router.patch('/updateItineraryFilteredFields/:guideId/:itineraryId', itineraryController.updateItineraryFilteredFields);
router.delete('/deleteSpecificItinerary/:guideId/:itineraryId', itineraryController.deleteSpecificItinerary);

module.exports = router;
