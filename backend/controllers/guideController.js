const Guide = require('../models/Guide');

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
