const Advertiser = require("../models/Advertiser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity");

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
      return res.status(404).json({ message: "Advertiser not found" });
    }
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update advertiser by ID
exports.updateAdvertiser = async (req, res) => {
  try {
    const updatedAdvertiser = await Advertiser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAdvertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
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
      return res.status(404).json({ message: "Advertiser not found" });
    }
    res.status(200).json({ message: "Advertiser deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//              req5 -- Tatos           //
// Geuest/Advertiser sign up
exports.guestAdvertiserCreateProfile = async (req, res) => {
  // TODO: validation of the input data

  // Allowed fields
  const allowedFields = ["username", "email", "pass", "id", "taxationRegCard"];

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach((field) => {
    // Loop through the allowed fields
    if (req.body[field] !== undefined) {
      // Check if the field exists in the request body
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

//new req 8

exports.createAdvertiserProfile = async (req, res) => {
  try {
    const { advertiserId } = req.params;
    const { link, hotline, companyProfile } = req.body;

    const advertiser = await Advertiser.findById(advertiserId).select("-pass");
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found." });
    }
    if (advertiser.pending) {
      return res.status(401).json({ message: "Waiting for admin approval." });
    }
    if (!advertiser.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and Conditions must be accepted." });
    }
    if (advertiser.companyProfile || advertiser.link || advertiser.hotline) {
      return res.status(401).json({ message: "Profile already exists." });
    }

    advertiser.link = link;
    advertiser.hotline = hotline;
    advertiser.companyProfile = companyProfile;

    const updatedAdvertiser = await advertiser.save();
    updatedAdvertiser.pass = undefined;
    res.status(200).json(updatedAdvertiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//--req8
exports.advertiserReadProfile = async (req, res) => {
  try {
    const advertiser = await Advertiser.findById(req.params.id).select("-pass");
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    if (advertiser.pending) {
      return res
        .status(401)
        .json({ message: "The profile is still pending approval." });
    }
    if (!advertiser.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and conditions must be accepted" });
    }
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// admin delete advertisers requesting deletion
exports.deleteAdvertisersRequestingDeletion = async (req, res) => {
  //middleware authentication
  try {
    const advertisers = await Advertiser.find({ requestingDeletion: true });
    if (advertisers.length === 0) {
      return res
        .status(404)
        .json({ message: "No advertisers found requesting deletion" });
    }

    for (const advertiser of advertisers) {
      await Advertiser.findByIdAndDelete(advertiser._id);
    }

    res.status(200).json({ message: "Advertisers deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//new req 8
exports.advertiserUpdateProfile = async (req, res) => {
  const allowedFields = ["email", "link", "hotline", "companyProfile", "logo"];

  const filteredBody = Object.keys(req.body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  try {
    const updatedAdvertiser = await Advertiser.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true }
    );

    if (!updatedAdvertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    const advertiser = await Advertiser.findById(req.params.id).select("-pass");

    if (!advertiser.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }

    // Generate a new JWT token
    const token = jwt.sign(
      { userId: advertiser._id, role: "advertiser", userDetails: advertiser }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    res.status(200).json({ updatedAdvertiser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//---req 26-----
exports.getAdvertiserActivities = async (req, res) => {
  try {
    const { advertiserId } = req.params;
    const activities = await Activity.find({ advertiserId });
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (advertiser.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    if (!activities || activities.length === 0) {
      return res
        .status(404)
        .json({ message: "No activities found for this advertiser" });
    }

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminDeletesAdvertisers = async (req, res) => {
  const advertiserIds = req.body.advertiserIds;
  if (!advertiserIds || !advertiserIds.length) {
    return res.status(400).json({ error: "Advertiser IDs are required" });
  }
  try {
    const result = await Advertiser.deleteMany({
      _id: { $in: advertiserIds },
      requestingDeletion: true,
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Advertisers selected were not requesting deletion" });
    }
    res
      .status(200)
      .json({ message: "Advertisers deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adminDeletesAdvertiserFromSystem = async (req, res) => {
  const advertiserId = req.params.id;
  if (!advertiserId) {
    return res.status(400).json({ error: "Advertiser ID is required" });
  }
  try {
    const result = await Activity.updateMany(
      { advertiserId: advertiserId }, // Find all activities with this advertiserId
      { $set: { hidden: true } } // Set hidden field to true
    );
    const deletedAdvertiser = await Advertiser.findByIdAndDelete(advertiserId);
    if (!deletedAdvertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    res
      .status(200)
      .json({ message: "Advertiser deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptTerms = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Advertiser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.pending) {
      return res.status(400).json({ message: "User is pending approval" });
    }
    user.acceptedTerms = true;
    await user.save();
    res.status(200).json({ message: "Terms accepted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//uploadLogo for specific advertiser
exports.uploadAdvertiserLogo = async (req, res) => {
  try {
    const advertiser = await Advertiser.findById(req.params.advertiserId);
    const logo = req.body.logo;
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    advertiser.logo = logo;
    await advertiser.save();
    res.status(200).json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get uploaded documents for adv by id: returns id w taxationregcard
exports.getAdvertiserDocuments = async (req, res) => {
  try {
    const { advertiserId } = req.params;
    const advertiser = await Advertiser.findById(advertiserId).select('id taxationRegCard');

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    const response = {
      message: "Documents retrieved successfully",
      id: advertiser.id || null,
      taxationRegCard: advertiser.taxationRegCard || null
    };

    if (!advertiser.id) {
      response.idMessage = "No ID document uploaded by this advertiser";
    }

    if (!advertiser.taxationRegCard) {
      response.taxationRegCardMessage = "No taxation registration card uploaded by this advertiser";
      response.taxationRegCard = null;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//admin accept advertiser
exports.acceptAdvertiser = async (req, res) => {
  try {
    const advertiserId = req.params.id;
    const advertiser = await Advertiser.findById(advertiserId);

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    if (!advertiser.pending) {
      return res.status(400).json({ message: "Advertiser is not in a pending state" });
    }

    advertiser.pending = false;
    await advertiser.save();

    res.status(200).json({ message: "Advertiser accepted successfully", advertiser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//admin reject Advertiser (deletes advertiser upon rejection)
exports.rejectAdvertiser = async (req, res) => {
  try {
    const advertiserId = req.params.id;
    const advertiser = await Advertiser.findById(advertiserId);

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    if (!advertiser.pending) {
      return res.status(400).json({ message: "Advertiser is not in a pending state" });
    }

    const deletedAdvertiser = await Advertiser.findByIdAndDelete(advertiserId);

    res.status(200).json({
      message: "Advertiser rejected and deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
