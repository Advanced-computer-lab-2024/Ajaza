const Seller = require('../models/Seller');

// Create a new seller
exports.createSeller = async (req, res) => {
  try {
    const seller = new Seller(req.body);
    const savedSeller = await seller.save();
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all sellers (admin Read all sellers)
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select('-pass'); // exclude password from the response
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seller by ID (seller Read profile)
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select('-pass'); // exclude password from the response
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update seller by ID
exports.updateSeller = async (req, res) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete seller by ID
exports.deleteSeller = async (req, res) => {
  try {
    const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
    if (!deletedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
