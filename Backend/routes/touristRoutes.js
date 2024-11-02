const express = require("express");
const router = express.Router();
const touristController = require("../controllers/touristController");
const apiController = require("../controllers/apiController");
const validateEmail = require("../middleware/validateEmail");
const uniqueEmail = require("../middleware/uniqueEmail");
const validateMobile = require("../middleware/validateMobile");
const uniqueUsername = require("../middleware/uniqueUsername");

const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

router.post("/", touristController.createTourist);

router.get("/", touristController.getAllTourists);

router.get("/:id", touristController.getTouristById);

router.patch("/:id", touristController.updateTourist);

router.delete("/deleteAgain/:id", touristController.deleteTourist);

//req 16 ng
router.delete(
  "/deleteTourists",
  touristController.deleteTouristsRequestingDeletion
);

// req11
router.patch(
  "/touristUpdateProfile/:id",
  validateEmail,
  validateMobile,
  touristController.touristUpdateProfile
);
/*
passed: id from params,
{
    email: String,
    mobile: String,
    occupation: String,
    nationality: String,
}

returns:
{
    username: String,
    email: String,
    mobile: String,
    points: Number,
    wallet: Number,
    badge: String,
    occupation: String,
    dob: Date,
    nationality: String,
}
*/

router.get("/touristReadProfile/:id", touristController.touristReadProfile);
/*
passed: id from params

returns:
{
    username: String,
    email: String,
    mobile: String,
    points: Number,
    wallet: Number,
    badge: String,
    occupation: String,
    dob: Date,
    nationality: String,
}
*/

// req50
router.post("/emailShare/:id", touristController.emailShare);

// req72
router.patch("/redeemPoints/:id", touristController.redeemPoints);

// req40
router.get("/flights/searchFlights", apiController.searchFlights);
router.post('/flights/bookFlight/:id', apiController.bookFlight);
// req41
router.get('/hotels/searchHotels', apiController.searchHotels);
router.post('/hotels/bookHotel/:id', apiController.bookHotel);

// req61
router.delete(
  "/:touristId/activity/:activityId/cancel",
  touristController.cancelActivityBooking
);
router.delete(
  "/:touristId/itinerary/:itineraryId/cancel",
  touristController.cancelItineraryBooking
);

// req58 req71 req70
router.post(
  "/:touristId/activity/:activityId/book",
  touristController.bookActivity
);
router.post(
  "/:touristId/itinerary/:itineraryId/book",
  touristController.bookItinerary
);

//req4      --Tatos
router.post(
  "/guestTouristCreateProfile",
  validateEmail,
  uniqueEmail,
  validateMobile,
  uniqueUsername,
  touristController.guestTouristCreateProfile
); // Guest Tourist sign up

router.delete("/deleteSomeTourists", touristController.adminDeletesTourists);

router.delete("/deleteSomeTourists", touristController.adminDeletesTourists);

//delete off system
router.delete(
  "/deleteTouristFromSystem/:id",
  touristController.adminDeletesTouristFromSystem
);

router.patch("/acceptTerms/:id", touristController.acceptTerms);

//req 111
router.get(
  "/promoCodes/getApplicablePromoCodes/:id",
  touristController.getApplicablePromoCodes
);

//req52-57
router.get("/history/getHistory/:id", touristController.getHistory);

//req63
router.get(
  "/future/getFutureBookings/:id",
  touristController.getFutureBookings
);

//req65
router.post(
  "/bookmark/addActivityBookmark/:touristId/:activityId",
  touristController.addActivityBookmark
);
router.post(
  "/bookmark/addItineraryBookmark/:touristId/:itineraryId",
  touristController.addItineraryBookmark
);

router.patch("/requestDeletion/:id", touristController.requestAccountDeletion);

module.exports = router;
