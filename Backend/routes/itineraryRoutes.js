const express = require("express");
const router = express.Router();
const itineraryController = require("../controllers/itineraryController");

router.post("/", itineraryController.createItinerary);

router.get("/", itineraryController.getAllItineraries);
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

module.exports = router;
