const Tourist = require('../models/Tourist');

// Create a new tourist
exports.createTourist = async (req, res) => {
  try {
    const tourist = new Tourist(req.body);
    const savedTourist = await tourist.save();
    res.status(201).json(savedTourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tourists
exports.getAllTourists = async (req, res) => {
  try {
    const tourists = await Tourist.find();
    res.status(200).json(tourists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tourist by ID
exports.getTouristById = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update tourist by ID
exports.updateTourist = async (req, res) => {
  try {
    const updatedTourist = await Tourist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete tourist by ID
exports.deleteTourist = async (req, res) => {
  try {
    const deletedTourist = await Tourist.findByIdAndDelete(req.params.id);
    if (!deletedTourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.status(200).json({ message: 'Tourist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
