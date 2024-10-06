const Governor = require('../models/Governor');
const Venue = require('../models/venue');
const Tag = require('../models/Tag');
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


// Create a new venue --- req 21------

exports.createGovernorVenue = async (req, res) => {
  try {
    const { governorId } = req.params; 
    const { name, desc, pictures, location, openingHours, price, tags } = req.body;
    const governor = await Governor.findById(governorId);
    if (!governor) {
      return res.status(404).json({ message: 'Governor not found' });
    }

    const newVenue = new Venue({
      governorId, 
      name,
      desc,
      pictures,
      location,
      openingHours,
      price,
      tags,
    });

    await newVenue.save();
    res.status(201).json(newVenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Read all visible venues with specific details
exports.readAllGovernorVenues = async (req, res) => {
  try {
    const { governorId } = req.params; 
    
    const venues = await Venue.find({ governorId, isVisible: true });

    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: 'No venues found for this governor.' });
    }

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a venue (only if the provided governorId matches the creator's)
exports.updateGovernorVenue = async (req, res) => {
  try {
    const { governorId, venueId } = req.params; 
    const updateData = req.body; // Use the whole request body for update

    // Find the venue and check if the governorId matches the creator's
    const venue = await Venue.findOne({ _id: venueId, governorId: governorId });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found or not authorized to update' });
    }

    Object.assign(venue, updateData); // Merge the updates into the existing venue
    await venue.save();

    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hide a venue (only if the provided governorId matches the creator's)
exports.deleteGovernorVenue = async (req, res) => {
  try {
    const { governorId,venueId } = req.params;

    // Find the venue and check if the governorId matches the creator's
    const venue = await Venue.findOne({ _id: venueId, governorId: governorId });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found or not authorized to hide' });
    }

    venue.isVisible = false;
    await venue.save();

    res.status(200).json({ message: 'Venue successfully removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// admin create a new governor
exports.adminAddGovernor = async (req, res) => {

  const { username, pass } = req.body;

  if (!username || !pass) {
    return res.status(400).json({ message: 'Username and pass are required.' });
  }

  const saltRounds = 10;
  const hashedPass = await bcrypt.hash(pass, saltRounds);

  try {
    const newGovernor = new Governor({ username, pass: hashedPass });
    const savedGovernor = await newGovernor.save();
    savedGovernor.pass = undefined;
    res.status(201).json(savedGovernor);
  } catch (error) {
    res.status(400).json({error: error.message });
  }
};

//--req 26---
exports.getGovernorVenues = async (req, res) => {
  try {
    const { governorId } = req.params;

    const venues = await Venue.find({ governorId, isVisible: true });

    if (!venues || venues.length === 0) {
      return res.status(404).json({ message: 'No venues found for this governor' });
    }

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//--req 22---

// create a new tag for a specific venue/'different historical locs'
exports.createTagForVenue = async (req, res) => {
  try {
    const { governorId, venueId } = req.params; 
    const { tag, preferenceTags } = req.body;

    const validTags = ['Monuments', 'Museums', 'Religious Sites', 'Palaces/Castles'];
    if (!validTags.includes(tag)) {
      return res.status(400).json({ message: 'Invalid tag. Valid tags are: Monuments, Museums, Religious Sites, Palaces/Castles.' });
    }

    // validate el preferenceTags to be an array of strings bs hya optional
    if (preferenceTags && !Array.isArray(preferenceTags)) {
      return res.status(400).json({ message: 'Invalid preference tags.' });
    }

    let newTag = await Tag.findOne({ tag });
    if (!newTag) {
      // create a new tag if it doesn't exist
      newTag = new Tag({ tag, preferanceTags: preferenceTags });
      await newTag.save();
    } else {
      // update el preferenceTags if the tag already exists
      newTag.preferanceTags = [...new Set([...newTag.preferanceTags, ...(preferenceTags || [])])];
      await newTag.save();
    }

    const venue = await Venue.findOne({ _id: venueId, governorId });
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found or you are not authorized to update this venue.' });
    }

    // add the new tag to the venue's tags array (ensure no duplicate tags)
    if (!venue.tags.includes(tag)) {
      venue.tags.push(tag);
    } else {
      return res.status(400).json({ message: 'Tag already exists for this venue.' });
    }

    await venue.save();

    res.status(200).json({ message: 'Tag and preference tags added to venue successfully', tag: newTag, venue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.adminDeletesGovernorFromSystem = async (req, res) => {
  const governorId = req.params.id;
  if(!governorId) {
    return res.status(400).json({ error: 'Governor ID is required' });
  }
  try {
    const result = await Venue.updateMany(
      { governorId: governorId }, // Find all activities with this governorId
      { $set: { isVisible: false } }      // Set hidden field to true
    );
    const deletedgovernor = await Governor.findByIdAndDelete(governorId);
    if (!deletedgovernor) {
      return res.status(404).json({ message: 'Governor not found' });
    }
    res.status(200).json({ message: 'Governor deleted successfully', result });
  } catch(error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptTerms = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Governor.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.acceptedTerms = true;
    await user.save();
    res.status(200).json({ message: 'Terms accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};