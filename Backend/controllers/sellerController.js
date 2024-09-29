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


          //              req5            //
          // Geuest/Seller sign up
exports.guestSellerCreateProfile = async (req, res) => {
  // TODO: validation of the input data

  // Allowed fields
  const allowedFields = ['username', 'email', 'pass','id', 'taxationRegCard'];

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach(field => { // Loop through the allowed fields
    if (req.body[field] !== undefined) { // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });

  try {
    const seller = new Seller(filteredBody);
    const savedSeller = await seller.save();
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





          //              req6            //

          // Seller sign up

exports.sellerCreateProfile = async (req, res) => {
  // TODO: validation of the input data

  // Allowed fields
  const allowedFields = ['username', 'email', 'pass', 'id', 'taxationRegCard', 'name', 'desc'];

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      filteredBody[field] = req.body[field];
    }
  });

  try {
    const seller = new Seller(filteredBody);
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
  // Allowed fields for update
  const allowedFields = ['username', 'email', 'pass', 'id', 'taxationRegCard', 'name', 'desc'];

  // Filter the request body
  const filteredBody = {}; 
  allowedFields.forEach(field => {  // Loop through the allowed fields
    if (req.body[field] !== undefined) { // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });

  try {
    const { pass, ...otherFields } = filteredBody; // Destructure the password from the filtered body

    // Retrieve the existing seller document
    const existingSeller = await Seller.findById(req.params.id);
    if (!existingSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // If a new password is provided, compare it with the existing hashed password
    // if (pass) {

    //   // Check if the new password is the same as the old password
    //   const isMatch = await bcrypt.compare(pass, existingSeller.pass);
    //   if (isMatch) {
    //     return res.status(400).json({ message: 'New password cannot be the same as old password' });
    //   }

    //   // Hash the new password before updating
    //   const salt = await bcrypt.genSalt(10);
    //   filteredBody.pass = await bcrypt.hash(pass, salt);
    // }

    // Proceed with the update
    const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, filteredBody, { new: true, runValidators: true });
    // runValidators: true is used to ensure that the updated document passes the schema validation rules
    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

