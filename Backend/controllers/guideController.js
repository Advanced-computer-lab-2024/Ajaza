const Guide = require("../models/Guide");
const Tourist = require("../models/Tourist");
const Itinerary = require("../models/Itinerary");
const jwt = require("jsonwebtoken"); // For decoding the JWT
const bcrypt = require("bcrypt"); // For hashing passwords

const Admin = require("../models/Admin"); // Adjust path as necessary
const Advertiser = require("../models/Advertiser"); // Adjust path as necessary
const Seller = require("../models/Seller"); // Adjust path as necessary
const Governor = require("../models/Governor"); // Adjust path as necessary

// Create a new guide
exports.createGuide = async (req, res) => {
  try {
    const guide = new Guide(req.body);
    const savedGuide = await guide.save();
    res.status(201).json(savedGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find();
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAcceptedGuides = async (req, res) => {
  try {
    const guides = await Guide.find({ pending: false });
    res.status(200).json(guides);
  } catch (error) {
    console.error("Error fetching accepted guides:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get guide by ID
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update guide by ID
exports.updateGuide = async (req, res) => {
  try {
    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json(updatedGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete guide by ID
exports.deleteGuide = async (req, res) => {
  try {
    const deletedGuide = await Guide.findByIdAndDelete(req.params.id);
    if (!deletedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req52 & req53
exports.giveGuideFeedback = async (req, res) => {
  // we are rating the guide who gave us the itinerary so passed is itineraryId
  //authentication middleware
  //validation middleware

  try {
    const { touristId, guideId } = req.params;
    const { rating, comments } = req.body;

    if (!rating || !comments) {
      return res.status(400).json({ message: "Bad request" });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the guide and append feedback
    const guide = await Guide.findById(guideId);
    if (!guide) {
      console.log(touristId);
      console.log(guideId);
      return res.status(404).json({ message: "Guide not found" });
    }

    const touristName = tourist.username;

    guide.feedback.push({ touristName, rating, comments });
    tourist.gaveFeedback.push(guideId);
    await tourist.save();
    await guide.save();

    res.status(200).json({
      message: "Feedback submitted successfully",
      feedback: guide.feedback,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware logic moved to controller
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format" };
  }

  return { isValid: true };
};

const checkEmailAvailability = async (email) => {
  if (!email) {
    return { isAvailable: false, message: "Email is required" };
  }

  try {
    // Check each collection for the email
    const touristExists = await Tourist.exists({ email });
    const advertiserExists = await Advertiser.exists({ email });
    const sellerExists = await Seller.exists({ email });
    const guideExists = await Guide.exists({ email });

    if (touristExists || advertiserExists || sellerExists || guideExists) {
      return {
        isAvailable: false,
        message: "Email is already associated with an account",
      };
    }

    return { isAvailable: true };
  } catch (error) {
    return { isAvailable: false, message: error.message };
  }
};

const checkUsernameAvailability = async (username) => {
  if (!username) {
    return { isAvailable: false, message: "Username is required" };
  }

  try {
    // Check each collection for the username
    const adminExists = await Admin.exists({ username });
    const touristExists = await Tourist.exists({ username });
    const advertiserExists = await Advertiser.exists({ username });
    const sellerExists = await Seller.exists({ username });
    const guideExists = await Guide.exists({ username });
    const governorExists = await Governor.exists({ username });

    if (
      adminExists ||
      touristExists ||
      advertiserExists ||
      sellerExists ||
      guideExists ||
      governorExists
    ) {
      return { isAvailable: false, message: "Username is already taken" };
    }

    return { isAvailable: true };
  } catch (error) {
    return { isAvailable: false, message: error.message };
  }
};

//              req5 -- Tatos           //
// Guest/Guide sign up
exports.guestGuideCreateProfile = async (req, res) => {
  // TODO: validation of the input data

  // Allowed fields
  const allowedFields = ["username", "email", "pass", "id", "certificates"];

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
    const usernameAvailability = await checkUsernameAvailability(
      filteredBody.username
    );
    if (!usernameAvailability.isAvailable) {
      return res.status(400).json({ message: usernameAvailability.message });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(filteredBody.pass, saltRounds);

    filteredBody.pass = hashedPassword;

    // Create new guide
    const guide = new Guide(filteredBody);
    const savedguide = await guide.save();
    savedguide.pass = undefined;
    res.status(201).json(savedguide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// admin delete guides requesting deletion
exports.deleteGuidesRequestingDeletion = async (req, res) => {
  //middleware auth
  try {
    const guides = await Guide.find({ requestingDeletion: true });

    if (guides.length === 0) {
      return res
        .status(404)
        .json({ message: "No guides found requesting deletion" });
    }

    for (const guide of guides) {
      await Guide.findByIdAndDelete(guide._id);
    }

    res.status(200).json({ message: "Guides deleted successfully" });
  } catch (error) {
    console.error("Error deleting guides:", error);
    res.status(500).json({ error: error.message });
  }
};

//-- by zeina: create profile for guide req 7
exports.createGuideProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { mobile, yearsOfExperience, previousWork } = req.body;

    const guide = await Guide.findById(id).select("-pass");
    if (!guide) {
      return res.status(404).json({ message: "Guide not found." });
    }
    if (guide.pending) {
      return res.status(401).json({ message: "Waiting for admin approval." });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and Conditions must be accepted." });
    }
    if (guide.mobile || guide.yearsOfExperience || guide.previousWork) {
      return res.status(400).json({ message: "Profile already created." });
    }

    guide.mobile = mobile;
    guide.yearsOfExperience = yearsOfExperience;
    guide.previousWork = previousWork;

    const updatedGuide = await guide.save();
    updatedGuide.pass = undefined;
    res.status(200).json(updatedGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get the profile of a guide by ID (Profile Retrieval)
exports.getGuideProfile = async (req, res) => {
  try {
    const guideId = req.params.id; // Get guideId from URL parameter
    const guide = await Guide.findById(guideId).select("-pass");

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (guide.pending) {
      return res
        .status(401)
        .json({ message: "The profile is still pending approval." });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and conditions must be accepted" });
    }

    res.status(200).json(guide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update profile by ID (Profile Update)
// Update profile by ID (Profile Update)
exports.updateGuideProfile = async (req, res) => {
  try {
    const guideId = req.params.id; // Get guideId from URL parameter
    const guide = await Guide.findById(guideId);
    // Update the guide's profile
    await Guide.findByIdAndUpdate(guideId, req.body);

    // Retrieve the updated guide's profile, filtering out the pass field
    const updatedGuide = await Guide.findById(guideId).select("-pass");

    if (!updatedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // Generate a new JWT token
    const token = jwt.sign(
      { userId: updatedGuide._id, role: "guide", userDetails: updatedGuide }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    res.status(200).json({ updatedGuide, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//--req26---
exports.getGuideItineraries = async (req, res) => {
  try {
    const { guideId } = req.params;

    const itineraries = await Itinerary.find({ guideId });

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.acceptedTerms) {
      return res
        .status(400)
        .json({ message: "Terms and conditions must be accepted" });
    }
    if (guide.pending) {
      return res
        .status(400)
        .json({ message: "The profile is still pending approval." });
    }
    if (!itineraries || itineraries.length === 0) {
      return res
        .status(404)
        .json({ message: "No itineraries found for this tour guide" });
    }

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminDeletesGuides = async (req, res) => {
  const guideIds = req.body.guideIds;
  if (!guideIds || !guideIds.length) {
    return res.status(400).json({ error: "Guide IDs are required" });
  }
  try {
    const result = await Guide.deleteMany({
      _id: { $in: guideIds },
      requestingDeletion: true,
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Guides selected were not requesting deletion" });
    }
    res.status(200).json({ message: "Guides deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adminDeletesGuideFromSystem = async (req, res) => {
  const guideId = req.params.id;
  if (!guideId) {
    return res.status(400).json({ error: "Guide ID is required" });
  }
  try {
    const result = await Itinerary.updateMany(
      { guideId: guideId }, // Find all activities with this guideId
      { $set: { hidden: true } } // Set hidden field to true
    );
    const deletedguide = await Guide.findByIdAndDelete(guideId);
    if (!deletedguide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json({ message: "Guide deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptTerms = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Guide.findById(id);
    const value = req.body.acceptedTerms;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.pending) {
      return res.status(400).json({ message: "User is pending approval" });
    }
    if (user.acceptedTerms && value === true) {
      return res
        .status(400)
        .json({ message: "User has already accepted terms" });
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

exports.uploadPhoto = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    guide.photo = req.body.photo;
    await guide.save();
    res.status(200).json({ message: "Photo uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get uploaded documents by id: returns id and certificates
// exports.getGuideDocuments = async (req, res) => {
//   try {
//     const guideId = req.params.id;
//     const guide = await Guide.findById(guideId).select("id certificates");

//     if (!guide) {
//       return res.status(404).json({ message: "Guide not found" });
//     }

//     const response = {
//       message: "Documents retrieved successfully",
//       id: guide.id || null,
//       certificates: guide.certificates.length > 0 ? guide.certificates : null,
//     };

//     if (!guide.id) {
//       response.idMessage = "No ID uploaded by this guide";
//     }

//     if (guide.certificates.length === 0) {
//       response.certificatesMessage = "No certificates uploaded by this guide";
//       response.certificates = null;
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//admin accept guide
exports.acceptGuide = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.pending) {
      return res
        .status(400)
        .json({ message: "Guide is not in a pending state" });
    }

    guide.pending = false;
    await guide.save();

    res.status(200).json({ message: "Guide accepted successfully", guide });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//admin reject guide (deletes guide upon rejection)
exports.rejectGuide = async (req, res) => {
  try {
    const guideId = req.params.id;
    const guide = await Guide.findById(guideId);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (!guide.pending) {
      return res
        .status(400)
        .json({ message: "Guide is not in a pending state" });
    }

    const deletedguide = await Guide.findByIdAndDelete(guideId);

    res.status(200).json({
      message: "Guide rejected and deleted successfully",
      //guideId: deletedguide._id, // You can return the deleted guide's ID if needed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestDeletion = async (req, res) => {
  try {
    const guideId = req.params.id; // Assuming guide ID is passed as a parameter

    // Find the guide by ID
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // Find itineraries related to the guide
    const itineraries = await Itinerary.find({ guideId });

    let hasUpcomingItinerary = false;

    // Check for upcoming itineraries
    for (const itinerary of itineraries) {
      // Find tourists who have booked this itinerary
      const tourists = await Tourist.find({
        "itineraryBookings.itineraryId": itinerary._id,
      });

      for (const tourist of tourists) {
        for (const booking of tourist.itineraryBookings) {
          if (
            booking.itineraryId.toString() === itinerary._id.toString() &&
            new Date(booking.date) > new Date()
          ) {
            hasUpcomingItinerary = true;
            break;
          }
        }
        if (hasUpcomingItinerary) break;
      }
      if (hasUpcomingItinerary) break;
    }

    if (!hasUpcomingItinerary) {
      // Set active attribute in all related itineraries to false
      for (const itinerary of itineraries) {
        itinerary.active = false;
        await itinerary.save();
      }

      // Set requestingDeletion in Guide to true
      guide.requestingDeletion = true;
      await guide.save();

      return res.status(200).json({
        message: "Account has been marked for deletion successfully.",
      });
    } else {
      return res.status(400).json({
        message: "Still has upcoming itineraries, can't request deletion.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.validateEmailUsername = async (req, res) => {
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// returns pending guides.
exports.getPendingGuides = async (req, res) => {
  try {
    const pendingGuides = await Guide.find({ pending: true });
    // if (pendingGuides.length === 0) {
    //   return res.status(404).json({ message: "No pending guides found." });
    // }
    res.status(200).json(pendingGuides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGuideDetails = async (req, res) => {
  const guideId = req.params.id;

  try {
    // Find the guide by ID and populate only the `id` field for the main ID image reference
    const guide = await Guide.findById(guideId)
      .populate({ path: "id", select: "_id" }) // Only populate `id` for the main ID image
      .exec();

    if (!guide) {
      return res.status(404).json({ message: "Guide not found." });
    }

    // Construct the image paths for certificates from the stored strings
    const certificates = guide.certificates.map(
      (cert) => `uploads/${cert}.jpg`
    );

    // Construct the response object with image paths for ID and certificates
    const responseGuide = {
      id: guide.id ? `uploads/${guide.id._id}.jpg` : null,
      certificates: certificates,
      username: guide.username,
      email: guide.email,
      link: guide.link || null,
      hotline: guide.hotline || null,
      companyProfile: {
        name: guide.companyProfile?.name || null,
        desc: guide.companyProfile?.desc || null,
        location: guide.companyProfile?.location || null,
      },
      pending: guide.pending,
      acceptedTerms: guide.acceptedTerms,
      requestingDeletion: guide.requestingDeletion || false,
    };

    // Return the guide details excluding sensitive information
    res.status(200).json(responseGuide);
  } catch (error) {
    console.error("Error fetching guide details:", error);
    res.status(500).json({ error: error.message });
  }
};

//req 28 - tatos (Not Done Yet)
exports.viewSalesReport = async (req, res) => {
  const guideId = req.params.id;
  try {
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (guide.pending) {
      return res.status(401).json({ message: "Waiting for admin approval" });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and Conditions must be accepted" });
    }
    if (guide.requestingDeletion) {
      return res
        .status(401)
        .json({ message: "Tour Guide is requesting deletion" });
    }

    const tourists = await Tourist.find({
      "itineraryBookings.itineraryId": { $exists: true },
    });
    if (!tourists || tourists.length === 0) {
      return res.status(404).json({ message: "No itinerary bookings found" });
    }

    let itineraryIds = [];
    tourists.forEach((tourist) => {
      itineraryIds = itineraryIds.concat(
        tourist.itineraryBookings.map((booking) => booking.itineraryId)
      );
    });

    let totalSales = 0;
    const report = [];

    // Fetch each itinerary and compare guideId
    for (const itineraryId of itineraryIds) {
      const itinerary = await Itinerary.findById(itineraryId).exec();

      if (itinerary && itinerary.guideId.toString() === guideId) {
        totalSales += itinerary.price;
        report.push({
          name: itinerary.name,
          price: itinerary.price,
          language: itinerary.language,
          accesibility: itinerary.accessibility,
        });
      }
    }

    console.log(`Total Sales: ${totalSales}`);

    res.status(200).json({
      totalSales,
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// req 30 - tatos (not done yet)
exports.viewTouristReport = async (req, res) => {
  const guideId = req.params.id;
  try {
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    if (guide.pending) {
      return res.status(401).json({ message: "Waiting for admin approval" });
    }
    if (!guide.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Terms and Conditions must be accepted" });
    }
    if (guide.requestingDeletion) {
      return res
        .status(401)
        .json({ message: "Tour Guide is requesting deletion" });
    }

    if (guide.pending) {
      return res.status(401).json({ message: "Guide is pending approval" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seeNotifications = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await Guide.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    for (let i = 0; i < user.notifications.length; i++) {
      user.notifications[i].seen = true;
    }

    await user.save();

    return res.status(200).json({ message: "Notifications seen successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.myItemsFeedback = async (req, res) => {
  try {
    const guideId = req.params.id;

    const itineraries = await Itinerary.find({ guideId });

    const allFeedback = itineraries.reduce((acc, itinerary) => {
      return acc.concat(itinerary.feedback);
    }, []);

    return {
      message: "Feedback returned successfully.",
      feedback: allFeedback,
    };
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.feedback = async (req, res) => {
  try {
    const guideId = req.params.id;

    const guide = await Guide.findById(guideId);

    if (!guide) return res.status(404).json({ message: "Guide not found" });

    const feedback = guide.feedback;
    return res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
