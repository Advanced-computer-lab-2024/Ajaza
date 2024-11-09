const Advertiser = require("../models/Advertiser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity");
const Tourist = require("../models/Tourist");

const Admin = require("../models/Admin");
const Guide = require("../models/Guide");
const Governor = require("../models/Governor");
const Seller = require("../models/Seller");

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

// Middleware logic moved to controller
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  return { isValid: true };
};

const checkEmailAvailability = async (email) => {
  if (!email) {
    return { isAvailable: false, message: 'Email is required' };
  }

  try {
    // Check each collection for the email
    const touristExists = await Tourist.exists({ email });
    const advertiserExists = await Advertiser.exists({ email });
    const sellerExists = await Seller.exists({ email });
    const guideExists = await Guide.exists({ email });

    if (touristExists || advertiserExists || sellerExists || guideExists) {
      return { isAvailable: false, message: 'Email is already associated with an account' };
    }

    return { isAvailable: true };
  } catch (error) {
    return { isAvailable: false, message: error.message };
  }
};

const checkUsernameAvailability = async (username) => {
  if (!username) {
    return { isAvailable: false, message: 'Username is required' };
  }

  try {
    // Check each collection for the username
    const adminExists = await Admin.exists({ username });
    const touristExists = await Tourist.exists({ username });
    const advertiserExists = await Advertiser.exists({ username });
    const sellerExists = await Seller.exists({ username });
    const guideExists = await Guide.exists({ username });
    const governorExists = await Governor.exists({ username });

    if (adminExists || touristExists || advertiserExists || sellerExists || guideExists || governorExists) {
      return { isAvailable: false, message: 'Username is already taken' };
    }

    return { isAvailable: true };
  } catch (error) {
    return { isAvailable: false, message: error.message };
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
    // Validate email
    const emailValidation = validateEmail(filteredBody.email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    // Check for unique email
    const emailAvailability = await checkEmailAvailability(filteredBody.email);
    if (!emailAvailability.isAvailable) {
      return res.status(400).json({ message: emailAvailability.message });
    }

    // Check for unique username
    const usernameAvailability = await checkUsernameAvailability(filteredBody.username);
    if (!usernameAvailability.isAvailable) {
      return res.status(400).json({ message: usernameAvailability.message });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(filteredBody.pass, saltRounds);

    filteredBody.pass = hashedPassword;

    // Create new advertiser
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
      { userId: updatedAdvertiser._id, role: "advertiser", userDetails: updatedAdvertiser }, // Include user data in the token
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
    const value = req.body.acceptedTerms;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.pending) {
      return res.status(400).json({ message: "User is pending approval" });
    }
    if (user.acceptedTerms && value === true) {
      return res.status(400).json({ message: "User has already accepted terms" });
    }
    if (value === false) {
      user.acceptedTerms = false;
      await user.save();
      return res.status(200).json({ message: "Terms declined successfully" });
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
// exports.getAdvertiserDocuments = async (req, res) => {
//   try {
//     const { advertiserId } = req.params;
//     const advertiser = await Advertiser.findById(advertiserId).select(
//       "id taxationRegCard"
//     );

//     if (!advertiser) {
//       return res.status(404).json({ message: "Advertiser not found" });
//     }

//     const response = {
//       message: "Documents retrieved successfully",
//       id: advertiser.id || null,
//       taxationRegCard: advertiser.taxationRegCard || null,
//     };

//     if (!advertiser.id) {
//       response.idMessage = "No ID document uploaded by this advertiser";
//     }

//     if (!advertiser.taxationRegCard) {
//       response.taxationRegCardMessage =
//         "No taxation registration card uploaded by this advertiser";
//       response.taxationRegCard = null;
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//admin accept advertiser
exports.acceptAdvertiser = async (req, res) => {
  try {
    const advertiserId = req.params.id;
    const advertiser = await Advertiser.findById(advertiserId);

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    if (!advertiser.pending) {
      return res
        .status(400)
        .json({ message: "Advertiser is not in a pending state" });
    }

    advertiser.pending = false;
    await advertiser.save();

    res
      .status(200)
      .json({ message: "Advertiser accepted successfully", advertiser });
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
      return res
        .status(400)
        .json({ message: "Advertiser is not in a pending state" });
    }

    const deletedAdvertiser = await Advertiser.findByIdAndDelete(advertiserId);

    res.status(200).json({
      message: "Advertiser rejected and deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestDeletion = async (req, res) => {
  try {
    const advertiserId = req.params.id; // Assuming advertiser ID is passed as a parameter

    // Find the advertiser by ID
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    // Find activities related to the advertiser
    const activities = await Activity.find({ advertiserId });

    let hasUpcomingActivity = false;

    // Check for upcoming activities
    for (const activity of activities) {
      // Find tourists who have booked this activity
      const tourists = await Tourist.find({
        "activityBookings.activityId": activity._id,
      });

      for (const tourist of tourists) {
        for (const booking of tourist.activityBookings) {
          if (
            booking.activityId.toString() === activity._id.toString() &&
            new Date(activity.date) > new Date()
          ) {
            hasUpcomingActivity = true;
            break;
          }
        }
        if (hasUpcomingActivity) break;
      }
      if (hasUpcomingActivity) break;
    }

    if (!hasUpcomingActivity) {
      // Set isOpen attribute in all related activities to false
      for (const activity of activities) {
        activity.isOpen = false;
        await activity.save();
      }

      // Set requestingDeletion in Advertiser to true
      advertiser.requestingDeletion = true;
      await advertiser.save();

      return res.status(200).json({
        message: "Account has been marked for deletion successfully.",
      });
    } else {
      return res.status(400).json({
        message: "Still has upcoming activities, can't request deletion.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.validateEmailUsername = async(req, res) =>{
  const { email, username } = req.body; // Destructure email and username from request body
  try {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    // Check for unique email
    const emailAvailability = await checkEmailAvailability(email);
    if (!emailAvailability.isAvailable) {
      return res.status(400).json({ message: emailAvailability.message });
    }

    // Check for unique username
    const usernameAvailability = await checkUsernameAvailability(username);
    if (!usernameAvailability.isAvailable) {
      return res.status(400).json({ message: usernameAvailability.message });
    }
    // If all validations pass, return a success message
    return res.status(200).json({ message: "Everything is valid!" });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// returns all advertisers that are pending
exports.getPendingAdvertisers = async (req, res) => {
  try {
    // Fetch advertisers with pending status
    const pendingAdvertisers = await Advertiser.find({ "pending" : true }).exec();
    
    if (pendingAdvertisers.length === 0) {
      return res.status(404).json({ message: "No advertisers with pending status found." });
    }
    
    // Return the found pending advertisers
    res.status(200).json(pendingAdvertisers);
  } catch (error) {
    console.error("Error fetching pending advertisers:", error);
    res.status(500).json({ error: error.message });
  }
};

//returns details to be displayed.
exports.getAdvertiserDetails = async (req, res) => {
  const advertiserId = req.params.id;

  try {
    
    // Find the advertiser by ID and populate image references
    const advertiser = await Advertiser.findById(advertiserId)
      .populate({ path: 'id', select: '_id' })  // Populate with _id to construct the image path
      .populate({ path: 'taxationRegCard', select: '_id' })
      .populate({ path: 'logo', select: '_id' })
      .exec();

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found." });
    }


    // Construct the response object with image paths for ID and Taxation Registration Card
    const responseAdvertiser = {
      id: advertiser.id ? `uploads/${advertiser.id._id}.jpg` : null,
      taxationRegCard: advertiser.taxationRegCard ? `uploads/${advertiser.taxationRegCard._id}.jpg` : null,
     // logo: advertiser.logo ? `uploads/${advertiser.logo._id}.jpg` : null,
      username: advertiser.username,
      email: advertiser.email,
      link: advertiser.link || null,
      hotline: advertiser.hotline || null,
      companyProfile: {
        name: advertiser.companyProfile?.name || null,
        desc: advertiser.companyProfile?.desc || null,
        location: advertiser.companyProfile?.location || null,
      },
      pending: advertiser.pending,
      acceptedTerms: advertiser.acceptedTerms,
      requestingDeletion: advertiser.requestingDeletion || false,
    };

    // Return the advertiser details excluding sensitive information
    res.status(200).json(responseAdvertiser);
  } catch (error) {
    console.error("Error fetching advertiser details:", error);
    res.status(500).json({ error: error.message });
  }
};


// req28 - tatos (Not Done Yet)
exports.viewSalesReport = async (req, res) => {
  const advertiserId = req.params.id;
  try {
    const advertiser = await Advertiser.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    if (advertiser.pending) {
      return res.status(401).json({ message: "Waiting for admin approval" });
    }
    if (!advertiser.acceptedTerms) {
      return res.status(401).json({ message: "Terms and Conditions must be accepted" });
    }
    if(advertiser.requestingDeletion){
      return res.status(401).json({ message: "Advertiser is requesting deletion" });
    }
    const activities = await Activity.find({ advertiserId });
    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: "No activities found for this advertiser" });
    }
    const sales = activities.map(activity => activity.sales);
    const totalSales = sales.reduce((acc, curr) => acc + curr, 0);
    res.status(200).json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

