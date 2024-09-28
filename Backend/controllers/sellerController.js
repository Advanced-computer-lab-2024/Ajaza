const Seller = require('../models/Seller');
const bcrypt = require('bcrypt');

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
    const sellers = await Seller.find() // exclude password from the response
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seller by ID (seller Read profile)
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id) // exclude password from the response
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
    const { pass } = req.body;

    // Retrieve the existing seller document
    const existingSeller = await Seller.findById(req.params.id).select('pass');
    if (!existingSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // If a new password is provided, compare it with the existing hashed password
    if (pass) {
      const isMatch = await bcrypt.compare(pass, existingSeller.pass);
      if (isMatch) {
        return res.status(400).json({ message: 'New password cannot be the same as old password' });
      }

      // Hash the new password before updating
      const salt = await bcrypt.genSalt(10);
      req.body.pass = await bcrypt.hash(pass, salt);
    }

    // Proceed with the update
    const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
