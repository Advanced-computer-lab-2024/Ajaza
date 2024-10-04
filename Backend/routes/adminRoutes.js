const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const uniqueUsername = require("../middleware/uniqueUsername");

router.post("/", adminController.createAdmin);

// this will probably not be used
router.get("/", adminController.getAllAdmins);

// probably used when product is out of stock (to send notification to admin who posted product)
router.get("/:id", adminController.getAdminById);

// for update password
router.patch("/:id", adminController.updateAdmin);

// this will probably be commented for security reasons
router.delete("/:id", adminController.deleteAdmin);

// req 17 ng, admin adds another admin
router.post("/addAdmin", uniqueUsername, adminController.adminAddAdmin);

module.exports = router;
