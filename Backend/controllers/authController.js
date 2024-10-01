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
    { model: Tourist, role: "Tourist" },
    { model: Advertiser, role: "Advertiser" },
    { model: TourGuide, role: "TourGuide" },
    { model: Seller, role: "Seller" },
    { model: TourismGovernor, role: "TourismGovernor" },
    { model: Admin, role: "Admin" },
  ];

  for (const { model, role } of userTypes) {
    const user = await model.findOne({ username });
    if (user) return { user, role };
  }
  return null;
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

    // Send token and role to the frontend
    res.status(200).json({ token, role, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
