const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");
const uploadPhotoImage = require("../middleware/uploadImage");
const uploadVenuePictures = require("../middleware/uploadVenuePictures");

router.post("/", venueController.createVenue);

router.get("/", venueController.getAllVenues);

//not hidden
router.get("/notHidden", venueController.getAllVenuesNH);


router.get("/visibleVenues", venueController.getAllVisibleVenues);

router.get("/:id", venueController.getVenueById);

// tags
router.patch("/:id", venueController.updateVenue);

router.delete("/:id", venueController.deleteVenue);

// req37
router.get("/searchForThis/searchAgain", venueController.searchByNameTag);


//upload photos to existing venue
router.post("/uploadPhotos/:venueId", uploadVenuePictures, venueController.uploadVenuePictures);

// req39
router.get("/preferrences/:id", venueController.getVenuesByPreferences);

module.exports = router;
