const Advertiser = require('../models/Advertiser');

// Create a new advertiser
exports.createAdvertiser = async (req, res) => {
  try {
    const advertiser = new Advertiser(req.body);
    const savedAdvertiser = await advertiser.save();
    res.status(201).json(savedAdvertiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all advertisers
exports.getAllAdvertisers = async (req, res) => {
  try {
    const advertisers = await Advertiser.find();
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get advertiser by ID
exports.getAdvertiserById = async (req, res) => {
  try {
    const advertiser = await Advertiser.findById(req.params.id);
    if (!advertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update advertiser by ID
exports.updateAdvertiser = async (req, res) => {
  try {
    const updatedAdvertiser = await Advertiser.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdvertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }
    res.status(200).json(updatedAdvertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete advertiser by ID
exports.deleteAdvertiser = async (req, res) => {
  try {
    const deletedAdvertiser = await Advertiser.findByIdAndDelete(req.params.id);
    if (!deletedAdvertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }
    res.status(200).json({ message: 'Advertiser deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};