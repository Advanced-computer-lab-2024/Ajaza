const express = require("express");
const router = express.Router();
const guideController = require("../controllers/guideController");
const uploadPhotoImage = require("../middleware/uploadPhotoImage");
const validateEmail = require("../middleware/validateEmail");
const uniqueEmail = require("../middleware/uniqueEmail");
const uniqueUsername = require("../middleware/uniqueUsername");
const validateMobile = require("../middleware/validateMobile");
const uploadIdCertificatesImage = require("../middleware/uploadIdCertificatesImage");

router.post("/", guideController.createGuide);

router.get("/", guideController.getAllGuides);

router.get("/:id", guideController.getGuideById);

router.patch("/:id", guideController.updateGuide);

router.delete("/deleteAgain/:id", guideController.deleteGuide);

//req 16 ng
router.delete("/deleteGuides", guideController.deleteGuidesRequestingDeletion);

// req52 & req53
router.post(
  "/:touristId/guide/:itineraryId/feedback",
  guideController.giveGuideFeedback
);
//req 7
router.post(
  "/addGuide/:id",
  validateMobile,
  guideController.createGuideProfile
);
router.get("/getGuideProfile/:id", guideController.getGuideProfile);
router.patch(
  "/updateGuideProfile/:id",
  validateMobile,
  uploadPhotoImage,
  guideController.updateGuideProfile
);

//req5  -- Tatos
router.post(
  "/guestGuideCreateProfile",
  uploadIdCertificatesImage,
  guideController.guestGuideCreateProfile
); // Guest Guide sign up

//req 26
router.get("/getMyItineraries/:guideId", guideController.getGuideItineraries);

router.delete("/deleteSomeGuides", guideController.adminDeletesGuides);

//delete off system
router.delete(
  "/deleteGuideFromSystem/:id",
  guideController.adminDeletesGuideFromSystem
);

router.patch("/acceptTerms/:id", guideController.acceptTerms);

router.post(
  "/uploadPhoto/:guideId",
  uploadPhotoImage,
  guideController.uploadPhoto
);

//for admin to view uploaded documents of a guide
router.get("/getDocuments/:id", guideController.getGuideDocuments);

//accept guide
router.put("/accept/:id", guideController.acceptGuide);

//reject guide
router.delete("/reject/:id", guideController.rejectGuide);

//request deletion
router.patch("/requestDeletion/:id", guideController.requestDeletion);

module.exports = router;
