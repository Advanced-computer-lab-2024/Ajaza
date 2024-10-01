const Guide = require('../models/Guide');
const Tourist = require('../models/Tourist');
const Itinerary = require('../models/Itinerary');
const jwt = require('jsonwebtoken'); // For decoding the JWT
const bcrypt = require('bcrypt'); // For hashing passwords

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
      return res.status(404).json({ message: 'Guide not found' });
    }
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update guide by ID
exports.updateGuide = async (req, res) => {
  try {
    const updatedGuide = await Guide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGuide) {
      return res.status(404).json({ message: 'Guide not found' });
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
      return res.status(404).json({ message: 'Guide not found' });
    }
    res.status(200).json({ message: 'Guide deleted successfully' });
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
    const { touristId, itineraryId } = req.params;
    const { rating, comments } = req.body;

    if(!rating || !comments) {
      return res.status(400).json({ message: 'Bad request' });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
        

    // find the itinerary booking by itineraryId, to rate the guide once per every itinerary booking
    const itineraryBooking = tourist.itineraryBookings.find(
      booking => booking.itineraryId.toString() === itineraryId && booking.date < new Date()
    );

    if (!itineraryBooking) {
      return res.status(400).json({ message: 'No valid past itinerary booking found' });
    }

    // find the itinerary to get the guideId
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    const guideId = itinerary.guideId;

    if(tourist.gaveFeedback.includes(guideId)) {
      return res.status(400).json({ message: 'Feedback already given for this guide' });
    }

    // Find the guide and append feedback
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    guide.feedback.push({ rating, comments });
    tourist.gaveFeedback.push(guideId);
    await tourist.save();

    await guide.save();

    res.status(200).json({ message: 'Feedback submitted successfully', feedback: guide.feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




          //              req5 -- Tatos           //
          // Guest/Guide sign up
exports.guestGuideCreateProfile = async (req, res) => {
  // TODO: validation of the input data

  // Allowed fields
  const allowedFields = ['username', 'email', 'pass','id', 'certificates'];

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach(field => { // Loop through the allowed fields
    if (req.body[field] !== undefined) { // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });

  try {
    const guide = new Guide(filteredBody);
    const savedguide = await guide.save();
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
      return res.status(404).json({ message: 'No guides found requesting deletion' });
    }

    for (const guide of guides) {
      await Guide.findByIdAndDelete(guide._id);
    }

    res.status(200).json({ message: 'Guides deleted successfully' });
  } catch (error) {
    console.error('Error deleting guides:', error);
    res.status(500).json({ error: error.message });
  }
};

//-- by zeina: create profile for guide req7 repeated, found out its already done by tatos
exports.createGuideProfile = async (req, res) => {
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

// Get the profile of a guide by ID (Profile Retrieval)
exports.getGuideProfile = async (req, res) => {
  try {
    const guideId = req.params.id; // Get guideId from URL parameter

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


// Update profile by ID (Profile Update)
exports.updateGuideProfile = async (req, res) => {
  try {
    const guideId = req.params.id; // Get guideId from URL parameter

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


