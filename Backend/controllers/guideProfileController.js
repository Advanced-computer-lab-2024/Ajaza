const Guide = require('../models/Guide.js');
const jwt = require('jsonwebtoken'); // For decoding the JWT
const bcrypt = require('bcrypt'); // For hashing passwords

// Create a new guide (Profile Creation)
const createGuide = async (req, res) => {
    try {
        const { username, email, pass, mobile, yearsOfExperience, previousWork, acceptedTerms } = req.body;

        // Check if the user with the same username exists
        const existingGuide = await Guide.findOne({ username });
        if (existingGuide) {
            return res.status(400).json({ message: 'Username or Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(pass, 10);

        // Create a new guide
        const guide = new Guide({
            username,
            email,
            pass: hashedPassword,
            mobile,
            yearsOfExperience,
            previousWork,
            acceptedTerms,
            pending: true, // Default to true until approved by admin
        });

        // Save the guide to the database
        const savedGuide = await guide.save();

        // Generate JWT token for the new guide
        const token = jwt.sign({ userId: savedGuide._id }, 'security_key', { expiresIn: '1h' });

        // Return the saved guide and token
        res.status(201).json({ guide: savedGuide, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get the profile of the authenticated guide (Profile Retrieval)
const getGuideProfile = async (req, res) => {
  try {
      const guideId = req.user.userId; // Use userId from the JWT token

      const guideProfile = await Guide.findById(guideId).select(
          '-pass -pending -acceptedTerms -notifications -requestingDeletion'
      );

      if (!guideProfile) {
          return res.status(404).json({ message: 'Guide not found' });
      }

      res.status(200).json(guideProfile);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Update profile (Profile Update)
const updateGuideProfile = async (req, res) => {
    try {
        const guideId = req.user.userId;

        // Update the guide's profile
        await Guide.findByIdAndUpdate(guideId, req.body);

        // Retrieve the updated guide's profile, filtering out sensitive fields
        const updatedGuide = await Guide.findById(guideId).select(
            '-pass -pending -acceptedTerms -notifications -requestingDeletion'
        );

        if (!updatedGuide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        res.status(200).json(updatedGuide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export the functions using module.exports
module.exports = {
    createGuide,
    getGuideProfile,
    updateGuideProfile,
    // Include other functions as needed
};
