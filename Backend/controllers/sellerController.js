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
    const sellers = await Seller.find()
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seller by ID (seller Read profile)
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id)
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update seller by ID (PATCH)

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


          //              req6            //

          // Seller sign up

exports.sellerCreateProfile = async (req, res) => {
  // TODO: validation of the input data

  try {
    const seller = new Seller(req.body);
    const savedSeller = await seller.save();
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


          // Seller read profile

exports.sellerReadProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select('-pass -id -taxationRegCard -acceptedTerms -notifications -requestingDeletion -__v');  // Exclude the multiple fields from the response
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


          // Seller update profile

// Seller update profile
exports.sellerUpdateProfile = async (req, res) => {
  try {
    const { pass, ...otherFields } = req.body;

    // Log the request body
    console.log('Request body:', req.body);

    // Retrieve the existing seller document
    const existingSeller = await Seller.findById(req.params.id);
    if (!existingSeller) {
      console.log('Seller not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Log the existing seller document
    console.log('Existing seller:', existingSeller);

    // If a new password is provided, compare it with the existing hashed password
    if (pass) {
      console.log('New password provided:', pass);
      const isMatch = await bcrypt.compare(pass, existingSeller.pass);
      console.log('Password match result:', isMatch);
      if (isMatch) {
        console.log('New password is the same as the old password');
        return res.status(400).json({ message: 'New password cannot be the same as old password' });
      }

      // Hash the new password before updating
      const salt = await bcrypt.genSalt(10);
      req.body.pass = await bcrypt.hash(pass, salt);
      console.log('Hashed new password:', req.body.pass);
    }

    // Compare other fields
    for (const [key, value] of Object.entries(otherFields)) {
      console.log(`Comparing field ${key}: new value = ${value}, old value = ${existingSeller[key]}`);
      if (existingSeller[key] === value) {
        console.log(`New ${key} is the same as old ${key}`);
        return res.status(400).json({ message: `New ${key} cannot be the same as old ${key}` });
      }
    }

    // Proceed with the update
    const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSeller) {
      console.log('Seller not found after update with ID:', req.params.id);
      return res.status(404).json({ message: 'Seller not found' });
    }
    console.log('Updated seller:', updatedSeller);
    res.status(200).json(updatedSeller);
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ error: error.message });
  }
};

