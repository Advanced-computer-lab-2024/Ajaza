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
router.post("/flights/searchFlights", apiController.searchFlights);
/*needs (origin and destination are IATA)
origin,
destination,
departureDate,
count
*/

router.post('/flights/bookFlight/:id', apiController.bookFlight);
/*needs (all these fields are returned from search earlier)
touristId, (params)
departureAirport,
totalDuration,
currency,
price,
departureTime,
departureTerminal,
arrivalAirport,
arrivalTime,
arrivalTerminal,
carrier,
flightNumber,
aircraft,
stops,
*/

// req41
router.post('/hotels/searchHotels', apiController.searchHotels);
/*
needs
dest_id, 
checkInDate,
checkOutDate,
count
*/

router.get('/hotels/fetchImagesPlz/:hotelName', apiController.fetchImagesPlz);

router.post('/hotels/bookHotel/:id', apiController.bookHotel);
/*needs
touristId, (params)
hotelName,
city,
price,
currency,
checkin,
checkout,
score,
*/

//helper for req41 to get details
router.get('/hotels/getDetails', apiController.getHotelDetails);
/*needs (all these fields were returned from searchHotels)
hotelName, 
checkin, 
checkout, 
count, 
dest_id, 
city, 
currency, 
score
*/

// req42
router.post('/transportation/searchTransportation', apiController.searchTransfer7);
/*needs
IATA,
endAddressLine,
startDateTime
*/

router.post('/transportation/bookTransportation/:id', apiController.bookTransfer);
/*needs
touristId (params),
transferType, 
start_dateTime, 
start_locationCode, 
end_dateTime, 
end_address_line, 
end_address_cityName, 
vehicle_code, 
vehicle_description, 
vehicle_seats, 
quotation_monetaryAmount, 
quotation_currencyCode, 
distance_value, 
distance_unit
*/
router.get('/transportation/getGeoLocation', apiController.testGeoLocation);

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

// Add to wishlist route
router.post("/add-to-wishlist", touristController.addToWishlist);

// View wishlist route
router.get("/wishlist/:touristId", touristController.viewWishlist);

// Remove from wishlist route
router.post("/remove-from-wishlist", touristController.removeFromWishlist);

// Add to cart from wishlist route
router.post(
  "/add-to-cart-from-wishlist",
  touristController.addToCartFromWishlist
);

// Add delivery address route
router.post("/add-delivery-address", touristController.addDeliveryAddress);

router.get("/3rdparty/:id", apiController.getAll3rdPartyData);

// req66
router.get("/getSavedEvents/:id", touristController.getSavedEvents);

// req65
router.post("/saveEvent/:id", touristController.saveEvent);

// req104 OR 101 either both is first function or 101 is first and 104 second
router.get("/orders/:id", touristController.getOrders);
router.get("/orders/order/:id", touristController.getOrder);

// req105
router.post("/orders/cancel/:id", touristController.cancelOrder);

// req98
router.post("/address/:id", touristController.addDeliveryAddress);

// req94
router.post("/cart/:id", touristController.addProductToCart);

// req96
router.post("/cart/changeQuantity/:id", touristController.changeQuantityInCart);

//req95
router.post("/cart/remove/:id", touristController.removeFromCart);

//req 97 big boss
router.post("/cart/checkout/:id", touristController.checkout);

router.post("/seeNotifications", touristController.seeNotifications);


module.exports = router;
