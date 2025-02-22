const express = require("express");
const router = express.Router();
const governorController = require("../controllers/governorController");
const uniqueUsername = require("../middleware/uniqueUsername");
const uploadVenuePicturesImage = require("../middleware/uploadImage");

router.post("/createAgain", governorController.createGovernor);
router.get("/countByMonth", governorController.countGovernersByMonth);


router.post("/createGov", governorController.createGovernor);

router.get("/getAllGov", governorController.getAllGovernors);

router.get("/getGov/:id", governorController.getGovernorById);

router.patch("/updateGov/:id", governorController.updateGovernor);

router.delete("/deleteGov/:id", governorController.deleteGovernor);


//---req 21----
/* create: 
 params needed: description, pictures, location, opening hours, ticket prices
 get: gets the governor venues even the hidden ones (all venues created by governor)
 update: in the url write the id of the venue and in the body give the governor id + the fields u want to update
 delete: in the url write the id of the venue and in the body provide the governor id 
*/
//router.post('/createGovernorVenue/:governorId', uploadVenuePicturesImage, governorController.createGovernorVenue);
router.post(
  "/createGovernorVenue/:governorId",
  governorController.createGovernorVenue
);
router.get(
  "/readAllGovernorVenues/:governorId",
  governorController.readAllGovernorVenues
);
router.put(
  "/updateGovernorVenue/:governorId/:venueId",
  governorController.updateGovernorVenue
);
router.delete(
  "/deleteGovernorVenue/:governorId/:venueId",
  governorController.deleteGovernorVenue
);

// req 17 ng
router.post(
  "/addGovernor",
  uniqueUsername,
  governorController.adminAddGovernor
);
//--req26--
router.get("/getMyVenues/:governorId", governorController.getGovernorVenues);

//--req 22--- body: venue id w tag w preference tag (u can put empty array [])
router.post(
  "/createTagForVenue/:governorId/:venueId",
  governorController.createTagForVenue
);

//delete from system
router.delete(
  "/deleteGovernorFromSystem/:id",
  governorController.adminDeletesGovernorFromSystem
);

router.patch("/acceptTerms/:id", governorController.acceptTerms);

module.exports = router;
