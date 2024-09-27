const Itinerary = require('../models/Itinerary');
const Tourist = require('../models/Tourist');


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

// req 37 NOT TESTED
exports.searchByName = async (req, res) => {
  const searchString = req.params.id;

  if (!searchString) {
    return res.status(400).json({ message: 'Search string is required' });
  }

  try {
    const itineraries = await Itinerary.find({
      name: { $regex: searchString, $options: 'i' }
    });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req54 & req55
exports.giveItineraryFeedback = async (req, res) => {
  try {
    const { touristId, itineraryId } = req.params;
    const { rating, comments } = req.body;

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const itineraryBooking = tourist.itineraryBookings.find(
      booking => booking.itineraryId.toString() === itineraryId && booking.date < new Date()
    );

    if (!itineraryBooking) {
      return res.status(400).json({ message: 'No valid past itinerary booking found' });
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    if(itinerary.date < new Date()) {
      return res.status(400).json({ message: 'No valid past itinerary booking found' });
    }

    // append the feedback to the itinerary
    itinerary.feedback.push({ rating, comments});

    await itinerary.save();

    res.status(200).json({ message: 'Feedback submitted successfully', feedback: itinerary.feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};