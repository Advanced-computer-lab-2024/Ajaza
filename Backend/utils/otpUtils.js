const crypto = require("crypto");

// Generate OTP
exports.generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};

// Temporary in-memory store for OTPs
exports.otpStore = {};
