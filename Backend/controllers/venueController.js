const Venue = require("../models/venue");

// Create a new venue
exports.createVenue = async (req, res) => {
  try {
    const venue = new Venue(req.body);
    const savedVenue = await venue.save();
    res.status(201).json(savedVenue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update venue by ID
exports.updateVenue = async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVenue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json(updatedVenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete venue by ID
exports.deleteVenue = async (req, res) => {
  try {
    const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
    if (!deletedVenue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req37 TESTED
exports.searchByNameTag = async (req, res) => {
  //authentication middleware

  const searchString = req.body.searchString;

  if (!searchString) {
    return res.status(400).json({ message: "Search string is required" });
  }

  try {
    const venues = await Venue.find({
      $or: [
        { name: { $regex: searchString, $options: "i" } },
        { tags: { $elemMatch: { $regex: searchString, $options: "i" } } },
      ],
    });

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllVisibleVenues = async (req, res) => {
  try {
    // Find venues where isVisible is true
    const venues = await Venue.find({ isVisible: true });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
