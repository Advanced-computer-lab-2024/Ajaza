const Admin = require('../models/Admin');
const Advertiser = require('../models/Advertiser');
const Governor = require('../models/Governor');
const Seller = require('../models/Seller');
const Tourist = require('../models/Tourist');
const Guide = require('../models/Guide');


// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    const savedAdmin = await admin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update admin by ID
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete admin by ID
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




//delete acc using id
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  //console.log(`Attempting to delete user with ID: ${userId}`);

  try {
    let deletedUser;
    let userType;

    // Check each model to see if the user exists
    deletedUser = await Seller.findByIdAndDelete(userId);
    if (deletedUser) {
      userType = 'Seller';
    } else {
      deletedUser = await Tourist.findByIdAndDelete(userId);
      if (deletedUser) userType = 'Tourist';
    }
    if (!deletedUser) {
      deletedUser = await Governor.findByIdAndDelete(userId);
      if (deletedUser) userType = 'Governor';
    }
    if (!deletedUser) {
      deletedUser = await Advertiser.findByIdAndDelete(userId);
      if (deletedUser) userType = 'Advertiser';
    }
    if (!deletedUser) {
      deletedUser = await Guide.findByIdAndDelete(userId);
      if (deletedUser) userType = 'Guide';
    }

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `${userType} deleted successfully` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
