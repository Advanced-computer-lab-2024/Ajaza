const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const uniqueUsername = require("../middleware/uniqueUsername");

router.post("/", adminController.createAdmin);

// this will probably not be used
router.get("/", adminController.getAllAdmins);

router.get("/countByMonth", adminController.countAdminsByMonth);


// probably used when product is out of stock (to send notification to admin who posted product)
router.get("/:id", adminController.getAdminById);

// for update password
router.patch("/:id", adminController.updateAdmin);

// this will probably be commented for security reasons
router.delete("/deleteAgain/:id", adminController.deleteAdmin);

// req 17 ng, admin adds another admin
router.post("/addAdmin", uniqueUsername, adminController.adminAddAdmin);

//delete off system
router.delete(
  "/deleteAdminFromSystem/:id",
  adminController.adminDeletesAdminFromSystem
);

router.delete("/deleteImgs", adminController.deleteImgs);

router.post("/seeNotifications/:id", adminController.seeNotifications);

// req 27 - tatos
router.get('/viewSalesReport/:id', adminController.viewSalesReport);

//router.get("/created/:year/:month", adminController.getUsersByMonth);




module.exports = router;
