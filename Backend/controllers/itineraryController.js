const Itinerary = require('../models/Itinerary');

// Create a new itinerary
exports.createItinerary = async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    const savedItinerary = await itinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all itineraries
exports.getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate('guideId').populate('activities.id').populate('venues');
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get itinerary by ID
exports.getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate('guideId').populate('activities.id').populate('venues');
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update itinerary by ID
exports.updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete itinerary by ID
exports.deleteItinerary = async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
