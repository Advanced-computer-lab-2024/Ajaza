const express = require("express");
const router = express.Router();
const advertiserController = require("../controllers/advertiserController");
const uploadIdImage = require("../middleware/uploadImage");
const uploadTaxationRegCardImage = require("../middleware/uploadImage");
const uploadLogoImage = require("../middleware/uploadLogoImage");
const validateEmail = require("../middleware/validateEmail");
const uniqueEmail = require("../middleware/uniqueEmail");
const uniqueUsername = require("../middleware/uniqueUsername");
const uploadIdTaxImage = require("../middleware/uploadIdTaxImage");

router.post("/", advertiserController.createAdvertiser);

router.get("/", advertiserController.getAllAdvertisers);

//req 12
router.get("/pending", advertiserController.getPendingAdvertisers);

router.get("/details/:id", advertiserController.getAdvertiserDetails);

router.get("/:id", advertiserController.getAdvertiserById);

router.patch("/:id", advertiserController.updateAdvertiser);

router.delete("/deleteAgain/:id", advertiserController.deleteAdvertiser);

// req 16 ng
router.delete(
  "/deleteAdvertisers",
  advertiserController.deleteAdvertisersRequestingDeletion
);

//req5  -- Tatos
router.post(
  "/guestAdvertiserCreateProfile",
  uploadIdTaxImage,
  advertiserController.guestAdvertiserCreateProfile
); // Guest Advertiser sign up

// Create advertiser (sign-up)
//router.post('/addAdvertiserProfile', advertiserController.createAdvertiserProfile);

// Get the profile of the authenticated advertiser
router.get(
  "/advertiserReadProfile/:id",
  advertiserController.advertiserReadProfile
);

// Update the profile of the authenticated advertiser
router.patch(
  "/advertiserUpdateProfile/:id",
  uploadLogoImage,
  advertiserController.advertiserUpdateProfile
);
router.post(
  "/createAdvertiserProfile/:advertiserId",
  advertiserController.createAdvertiserProfile
);

//----req26---
router.get(
  "/getMyActivities/:advertiserId",
  advertiserController.getAdvertiserActivities
);

router.delete(
  "/deleteSomeAdvertisers",
  advertiserController.adminDeletesAdvertisers
);

//delete off system
router.delete(
  "/deleteAdvertiserFromSystem/:id",
  advertiserController.adminDeletesAdvertiserFromSystem
);

router.patch("/acceptTerms/:id", advertiserController.acceptTerms);

router.post(
  "/uploadLogo/:advertiserId",
  uploadLogoImage,
  advertiserController.uploadAdvertiserLogo
);

//for admin to view uploaded documents of a advertiser
// router.get(
//   "/getDocuments/:advertiserId",
//   advertiserController.getAdvertiserDocuments
// ); //id walla advertiserId

//accept advertiser
router.put("/accept/:id", advertiserController.acceptAdvertiser);

//reject advertiser
router.delete("/reject/:id", advertiserController.rejectAdvertiser);

//request deletion
router.patch("/requestDeletion/:id", advertiserController.requestDeletion);


router.post("/validateEmailUsername", advertiserController.validateEmailUsername); // New route for email and username validation

//req12


module.exports = router;
