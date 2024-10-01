const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Login and register routes
router.post("/login", authController.login);

module.exports = router;
