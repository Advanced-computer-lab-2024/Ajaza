const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { forgotPassword, verifyOTP } = require("../controllers/authController");

// Login and register routes
router.post("/login", authController.login);

// Route to change password
router.post("/change-password/:id", authController.changePassword);

// Route to handle forgot password (send OTP)
router.post("/forgot-password", forgotPassword);

// Route to handle OTP verification and password reset
router.post("/verify-otp", verifyOTP);

module.exports = router;
