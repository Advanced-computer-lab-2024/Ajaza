const Guide = require("../models/Guide");
const Tourist = require("../models/Tourist");
const Itinerary = require("../models/Itinerary");
const jwt = require("jsonwebtoken"); // For decoding the JWT
const bcrypt = require("bcrypt"); // For hashing passwords

// Create a new guide
exports.createGuide = async (req, res) => {
  try {
    const guide = new Guide(req.body);
    const savedGuide = await guide.save();
    res.status(201).json(savedGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find();
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get guide by ID
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update guide by ID
exports.updateGuide = async (req, res) => {
  try {
    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json(updatedGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete guide by ID
exports.deleteGuide = async (req, res) => {
  try {
    const deletedGuide = await Guide.findByIdAndDelete(req.params.id);
    if (!deletedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req52 & req53
exports.giveGuideFeedback = async (req, res) => {
  // we are rating the guide who gave us the itinerary so passed is itineraryId
  //authentication middleware
  //validation middleware

  try {
    const { touristId, guideId } = req.params;
    const { rating, comments } = req.body;

    if (!rating || !comments) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the guide and append feedback
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    guide.feedback.push({ rating, comments });
    tourist.gaveFeedback.push(guideId);
    await tourist.save();
    await guide.save();

    res.status(200).json({
      message: "Feedback submitted successfully",
      feedback: guide.feedback,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//              req5 -- Tatos           //
// Guest/Guide sign up
exports.guestGuideCreateProfile = async (req, res) => {
  // TODO: validation of the input data

  // Allowed fields
  const allowedFields = ["username", "email", "pass", "id", "certificates"];

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach((field) => {
    // Loop through the allowed fields
    if (req.body[field] !== undefined) {
      // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(filteredBody.pass, saltRounds);

    filteredBody.pass = hashedPassword;

    const guide = new Guide(filteredBody);
    const savedguide = await guide.save();
    savedguide.pass = undefined;
    res.status(201).json(savedguide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// admin delete guides requesting deletion
exports.deleteGuidesRequestingDeletion = async (req, res) => {
  //middleware auth
  try {
    const guides = await Guide.find({ requestingDeletion: true });

    if (guides.length === 0) {
      return res
        .status(404)
        .json({ message: "No guides found requesting deletion" });
    }

    for (const guide of guides) {
      await Guide.findByIdAndDelete(guide._id);
    }

    res.status(200).json({ message: "Guides deleted successfully" });
  } catch (error) {
    console.error("Error deleting guides:", error);
    res.status(500).json({ error: error.message });
  }
};

//-- by zeina: create profile for guide req 7
exports.createGuideProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile, yearsOfExperience, previousWork } = req.body;

    const guide = await Guide.findById(id).select("-pass");
    if (!guide) {
      return res.status(404).json({ message: "Guide not found." });
    }
    if (guide.pending) {
      return res.status(401).json({ message: "Waiting for admin approval." });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and Conditions must be accepted." });
    }
    if (guide.mobile || guide.yearsOfExperience || guide.previousWork) {
      return res.status(400).json({ message: "Profile already created." });
    }

    guide.mobile = mobile;
    guide.yearsOfExperience = yearsOfExperience;
    guide.previousWork = previousWork;

    const updatedGuide = await guide.save();
    updatedGuide.pass = undefined;
    res.status(200).json(updatedGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the profile of a guide by ID (Profile Retrieval)
exports.getGuideProfile = async (req, res) => {
  try {
    const guideId = req.params.id; // Get guideId from URL parameter
    const guide = await Guide.findById(guideId).select("-pass");

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (guide.pending) {
      return res
        .status(401)
        .json({ message: "The profile is still pending approval." });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and conditions must be accepted" });
    }

    res.status(200).json(guide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update profile by ID (Profile Update)
// Update profile by ID (Profile Update)
exports.updateGuideProfile = async (req, res) => {
  try {
    const guideId = req.params.id; // Get guideId from URL parameter
    const guide = await Guide.findById(guideId);
    // Update the guide's profile
    await Guide.findByIdAndUpdate(guideId, req.body);

    // Retrieve the updated guide's profile, filtering out the pass field
    const updatedGuide = await Guide.findById(guideId).select("-pass");

    if (!updatedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // Generate a new JWT token
    const token = jwt.sign(
      { userId: updatedGuide._id, role: "guide", userDetails: updatedGuide }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    res.status(200).json({ updatedGuide, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//--req26---
exports.getGuideItineraries = async (req, res) => {
  try {
    const { guideId } = req.params;

    const itineraries = await Itinerary.find({ guideId });

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (guide.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    if (!itineraries || itineraries.length === 0) {
      return res
        .status(404)
        .json({ message: "No itineraries found for this tour guide" });
    }

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminDeletesGuides = async (req, res) => {
  const guideIds = req.body.guideIds;
  if (!guideIds || !guideIds.length) {
    return res.status(400).json({ error: "Guide IDs are required" });
  }
  try {
    const result = await Guide.deleteMany({
      _id: { $in: guideIds },
      requestingDeletion: true,
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Guides selected were not requesting deletion" });
    }
    res.status(200).json({ message: "Guides deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adminDeletesGuideFromSystem = async (req, res) => {
  const guideId = req.params.id;
  if (!guideId) {
    return res.status(400).json({ error: "Guide ID is required" });
  }
  try {
    const result = await Itinerary.updateMany(
      { guideId: guideId }, // Find all activities with this guideId
      { $set: { hidden: true } } // Set hidden field to true
    );
    const deletedguide = await Guide.findByIdAndDelete(guideId);
    if (!deletedguide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json({ message: "Guide deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptTerms = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Guide.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.pending) {
      return res.status(400).json({ message: "User is pending approval" });
    }
    user.acceptedTerms = true;
    await user.save();
    res.status(200).json({ message: "Terms accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    guide.photo = req.body.photo;
    await guide.save();
    res.status(200).json({ message: "Photo uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// get uploaded documents by id: returns id and certificates
exports.getGuideDocuments = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId).select('id certificates');

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    const response = {
      message: "Documents retrieved successfully",
      id: guide.id || null,
      certificates: guide.certificates.length > 0 ? guide.certificates : null
    };

    if (!guide.id) {
      response.idMessage = "No ID uploaded by this guide";
    }

    if (guide.certificates.length === 0) {
      response.certificatesMessage = "No certificates uploaded by this guide";
      response.certificates = null;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//admin accept guide
exports.acceptGuide = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.pending) {
      return res.status(400).json({ message: "Guide is not in a pending state" });
    }

    guide.pending = false;
    await guide.save();

    res.status(200).json({ message: "Guide accepted successfully", guide });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//admin reject guide (deletes guide upon rejection)
exports.rejectGuide = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.pending) {
      return res.status(400).json({ message: "Guide is not in a pending state" });
    }

    const deletedguide = await Guide.findByIdAndDelete(guideId);

    res.status(200).json({
      message: "Guide rejected and deleted successfully",
      //guideId: deletedguide._id, // You can return the deleted guide's ID if needed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
