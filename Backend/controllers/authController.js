const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Tourist = require("../models/Tourist");
const Advertiser = require("../models/Advertiser");
const TourGuide = require("../models/Guide");
const Seller = require("../models/Seller");
const TourismGovernor = require("../models/Governor");
const Admin = require("../models/Admin");
const { sendOTP } = require("../services/emailService");
const { generateOTP, otpStore } = require("../utils/otpUtils");
const OTP_EXPIRY_TIME = 15 * 60 * 1000;

// Utility: Verify JWT token (middleware)
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Using environment variable
    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Utility function to find a user across all models
const findUserAcrossModels = async (username) => {
  const userTypes = [
    { model: Tourist, role: "tourist" },
    { model: Advertiser, role: "advertiser" },
    { model: TourGuide, role: "guide" },
    { model: Seller, role: "seller" },
    { model: TourismGovernor, role: "governor" },
    { model: Admin, role: "admin" },
  ];

  for (const { model, role } of userTypes) {
    const user = await model.findOne({ username });
    if (user) return { user, role };
  }
  return null;
};

// Utility function to map user to detailed object with all fields
const mapUserDetails = (user, schema) => {
  const userDetails = {};
  for (const key in schema.paths) {
    if (schema.paths.hasOwnProperty(key) && key !== "__v" && key !== "pass") {
      userDetails[key] = user[key] !== undefined ? user[key] : null;
    }
  }
  return userDetails;
};

const mapUserDetailsAhmed = (user, schema) => {
  const userDetails = {};
  let cpn = "";
  let cpd = "";
  let cpl = "";
  for (const key in schema.paths) {
    if (schema.paths.hasOwnProperty(key) && key !== "__v" && key !== "pass") {
      if (key === "companyProfile.name") {
        cpn = user.companyProfile.name;
      } else if (key === "companyProfile.desc") {
        cpd = user.companyProfile.location;
      } else if (key === "companyProfile.location") {
        cpl = user.companyProfile.desc;
      } else {
        userDetails[key] = user[key] !== undefined ? user[key] : null;
      }
    }
  }
  userDetails.companyProfile = {
    name: cpn,
    location: cpd,
    desc: cpl,
  };
  return userDetails;
};

// Login user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user across all models
    const result = await findUserAcrossModels(username);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    const { user, role } = result;

    const isMatchPlain = password === user.pass;
    const isMatch = await bcrypt.compare(password, user.pass);
    if (!isMatch && !isMatchPlain) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Map user details
    let userDetails = {};
    if (role === "tourist") {
      userDetails = mapUserDetails(user, Tourist.schema);
    }
    if (role === "advertiser") {
      userDetails = mapUserDetailsAhmed(user, Advertiser.schema);
    }
    if (role === "guide") {
      userDetails = mapUserDetails(user, TourGuide.schema);
    }
    if (role === "seller") {
      userDetails = mapUserDetails(user, Seller.schema);
    }
    if (role === "governor") {
      userDetails = mapUserDetails(user, TourismGovernor.schema);
    }
    if (role === "admin") {
      userDetails = mapUserDetails(user, Admin.schema);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role, userDetails }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    // Send token, role, and user details to the frontend
    console.log(userDetails);
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user;
    // Check the user type and find the user by email in the corresponding model
    if (role === "tourist") {
      user = await Tourist.findOne({ email });
    } else if (role === "guide") {
      user = await TourGuide.findOne({ email });
    } else if (role === "advertiser") {
      user = await Advertiser.findOne({ email });
    } else if (role === "seller") {
      user = await Seller.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP and store it temporarily
    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + OTP_EXPIRY_TIME };

    // Send OTP via email
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP and reset password
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, newPassword, role } = req.body;

    // Check if OTP exists and is valid
    const storedOTP = otpStore[email];
    if (
      !storedOTP ||
      storedOTP.otp !== otp ||
      Date.now() > storedOTP.expiresAt
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find the user by email based on the role
    let user;
    if (role === "tourist") {
      user = await Tourist.findOne({ email });
    } else if (role === "guide") {
      user = await Guide.findOne({ email });
    } else if (role === "advertiser") {
      user = await Advertiser.findOne({ email });
    } else if (role === "seller") {
      user = await Seller.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.pass = hashedPassword;
    await user.save();

    // Clear OTP after successful reset
    delete otpStore[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, role } = req.body;
    const userId = req.params.id; // Assuming user ID is passed as a parameter

    // Find the user by ID based on the role
    let user;
    if (role === "tourist") {
      user = await Tourist.findById(userId);
    } else if (role === "guide") {
      user = await Guide.findById(userId);
    } else if (role === "advertiser") {
      user = await Advertiser.findById(userId);
    } else if (role === "seller") {
      user = await Seller.findById(userId);
    } else if (role === "governor") {
      user = await TourismGovernor.findById(userId);
    } else if (role === "admin") {
      user = await Admin.findById(userId);
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided old password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(oldPassword, user.pass);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.pass);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password in the database
    user.pass = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
