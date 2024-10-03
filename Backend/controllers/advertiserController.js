const Advertiser = require('../models/Advertiser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');

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


          //              req5 -- Tatos           //
          // Geuest/Advertiser sign up
exports.guestAdvertiserCreateProfile = async (req, res) => {
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

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(filteredBody.pass, saltRounds);

    filteredBody.pass = hashedPassword;

    const advertiser = new Advertiser(filteredBody);
    const savedadvertiser = await advertiser.save();
    savedadvertiser.pass = undefined;
    res.status(201).json(savedadvertiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



//new
exports.advertiserReadProfile = async (req, res) => {
  try {
    const advertiserProfile = await Advertiser.findById(req.params.id)
      .select('-pass -taxationRegCard -pending -notifications -acceptedTerms');

    if (!advertiserProfile) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }
    res.status(200).json(advertiserProfile);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// admin delete advertisers requesting deletion
exports.deleteAdvertisersRequestingDeletion = async (req, res) => {
  //middleware authentication
  try {
    const advertisers = await Advertiser.find({ requestingDeletion: true });
    if (advertisers.length === 0) {
      return res.status(404).json({ message: 'No advertisers found requesting deletion' });
    }

    for (const advertiser of advertisers) {
      await Advertiser.findByIdAndDelete(advertiser._id);
    }

    res.status(200).json({ message: 'Advertisers deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//new
exports.advertiserUpdateProfile = async (req, res) => {

  const allowedFields = ['email', 'link', 'hotline', 'companyProfile'];

  const filteredBody = Object.keys(req.body)
    .filter(key => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  try {
    const updatedAdvertiser = await Advertiser.findByIdAndUpdate(req.params.id, filteredBody, { new: true });
    if (!updatedAdvertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }
    res.status(200).json(updatedAdvertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// Get the profile of the authenticated advertiser (Profile Retrieval) OLD
exports.getAdvertiserProfile = async (req, res) => {
  try {
      const advertiserId = req.user.userId; // Use userId from the JWT token

      const advertiserProfile = await Advertiser.findById(advertiserId).select(
          '-pass -pending -acceptedTerms -notifications -requestingDeletion'
      );

      if (!advertiserProfile) {
          return res.status(404).json({ message: 'Advertiser not found' });
      }

      res.status(200).json(advertiserProfile);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
// Update profile (Profile Update) OLD
exports.updateAdvertiserProfile = async (req, res) => {
    try {
        const advertiserId = req.user.userId;
        if (req.body.pass) {
            req.body.pass = await bcrypt.hash(req.body.pass, 10);
        }
        
        // Update the guide's profile
        await Advertiser.findByIdAndUpdate(advertiserId, req.body);

        // Retrieve the updated guide's profile, filtering out sensitive fields
        const updatedAdvertiser = await Advertiser.findById(advertiserId).select(
            '-pass -pending -acceptedTerms -notifications -requestingDeletion'
        );

        if (!updatedAdvertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }

        res.status(200).json(updatedAdvertiser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//---req 26-----
exports.getAdvertiserActivities = async (req, res) => {
  try {
    const { advertiserId } = req.params;
    const activities = await Activity.find({ advertiserId });

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for this advertiser' });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminDeletesAdvertisers = async (req, res) => {
  const advertiserIds = req.body.advertiserIds;
  if(!advertiserIds || !advertiserIds.length) {
    return res.status(400).json({ error: 'Advertiser IDs are required' });
  }
  try {
    const result = await Advertiser.deleteMany({ _id: { $in: advertiserIds }, requestingDeletion: true});
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Advertisers selected were not requesting deletion' });
    }
    res.status(200).json({ message: 'Advertisers deleted successfully', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};