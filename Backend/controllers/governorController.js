const Governor = require('../models/Governor');
const bcrypt = require('bcrypt');


// Create a new governor
exports.createGovernor = async (req, res) => {
  try {
    const governor = new Governor(req.body);
    const savedGovernor = await governor.save();
    res.status(201).json(savedGovernor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all governors
exports.getAllGovernors = async (req, res) => {
  try {
    const governors = await Governor.find();
    res.status(200).json(governors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get governor by ID
exports.getGovernorById = async (req, res) => {
  try {
    const governor = await Governor.findById(req.params.id);
    if (!governor) {
      return res.status(404).json({ message: 'Governor not found' });
    }
    res.status(200).json(governor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update governor by ID
exports.updateGovernor = async (req, res) => {
  try {
    const updatedGovernor = await Governor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGovernor) {
      return res.status(404).json({ message: 'Governor not found' });
    }
    res.status(200).json(updatedGovernor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete governor by ID
exports.deleteGovernor = async (req, res) => {
  try {
    const deletedGovernor = await Governor.findByIdAndDelete(req.params.id);
    if (!deletedGovernor) {
      return res.status(404).json({ message: 'Governor not found' });
    }
    res.status(200).json({ message: 'Governor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// admin create a new governor
exports.adminAddGovernor = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const existingGovernor = await Governor.findOne({ username });
    if (existingGovernor) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newGovernor = new Governor({ username, pass: hashedPassword });

    const savedGovernor = await newGovernor.save();
    
    res.status(201).json({ message: 'Governor created successfully', governor: savedGovernor });
  } catch (error) {
    console.error('Error while saving the Governor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
