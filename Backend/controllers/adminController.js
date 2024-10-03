const Admin = require('../models/Admin');
const Advertiser = require('../models/Advertiser');
const Governor = require('../models/Governor');
const Seller = require('../models/Seller');
const Tourist = require('../models/Tourist');
const Guide = require('../models/Guide');
const bcrypt = require('bcrypt');



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

// req 17 ng
//admin adds another admin
exports.adminAddAdmin = async (req, res) => {

  const { username, pass } = req.body;

  if (!username || !pass) {
    return res.status(400).json({ message: 'Username and pass are required.' });
  }

  const saltRounds = 10;
  const hashedPass = await bcrypt.hash(pass, saltRounds);

  try {
    const newadmin = new Admin({ username, pass: hashedPass });
    const savedadmin = await newadmin.save();
    savedadmin.pass = undefined;
    res.status(201).json(savedadmin);
  } catch (error) {
    res.status(400).json({error: error.message });
  }
};