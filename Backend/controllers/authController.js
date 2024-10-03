const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Tourist = require("../models/Tourist");
const Advertiser = require("../models/Advertiser");
const TourGuide = require("../models/Guide");
const Seller = require("../models/Seller");
const TourismGovernor = require("../models/Governor");
const Admin = require("../models/Admin");

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

    // Compare the provided password with the stored password
    if (password !== user.pass) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    // Map user details
    let userDetails = {};
    if (role === "tourist") {
      userDetails = mapUserDetails(user, Tourist.schema);
    }
    if (role === "advertiser") {
      userDetails = mapUserDetails(user, Advertiser.schema);
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

    // Send token, role, and user details to the frontend
    res
      .status(200)
      .json({ token, role, userDetails, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
