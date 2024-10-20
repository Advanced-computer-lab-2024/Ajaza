const Seller = require("../models/Seller");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const sellers = await Seller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seller by ID (seller Read profile)
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
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
    const existingSeller = await Seller.findById(req.params.id).select("pass");
    if (!existingSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // If a new password is provided, compare it with the existing hashed password
    if (pass) {
      const isMatch = await bcrypt.compare(pass, existingSeller.pass);
      if (isMatch) {
        return res
          .status(400)
          .json({ message: "New password cannot be the same as old password" });
      }

      // Hash the new password before updating
      const salt = await bcrypt.genSalt(10);
      req.body.pass = await bcrypt.hash(pass, salt);
    }

    // Proceed with the update
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-pass");

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Generate a new JWT token
    const token = jwt.sign(
      { userId: updatedSeller._id, role: "seller", userDetails: updatedSeller }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    res.status(200).json({ updatedSeller, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete seller by ID
exports.deleteSeller = async (req, res) => {
  try {
    const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//              req5            //
// Geuest/Seller sign up
exports.guestSellerCreateProfile = async (req, res) => {
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

    const seller = new Seller(filteredBody);
    const savedSeller = await seller.save();
    savedSeller.pass = undefined;
    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//              req6            //

// Seller create profile

exports.sellerCreateProfile = async (req, res) => {
  const sellerId = req.params.id;

  // Allowed fields

  const allowedFields = ["name", "desc"];
  if (!req.body.name || !req.body.desc) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  // Filter the request body
  const filteredBody = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      filteredBody[field] = req.body[field];
    }
  });

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    if (seller.pending === true || seller.acceptedTerms === false) {
      return res.status(401).json({
        message:
          "Seller is pending approval or has not accepted terms and condition",
      });
    }
    if (seller.name || seller.desc) {
      return res.status(401).json({ message: "Profile already exists" });
    }

    const newSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { $set: filteredBody },
      { new: true, runValidators: true }
    );
    newSeller.pass = undefined;
    res.status(201).json(newSeller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Seller read profile

exports.sellerReadProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select(
      "-pass -id -taxationRegCard"
    ); // Exclude the multiple fields from the response
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    if (seller.pending === true || seller.acceptedTerms === false) {
      return res.status(401).json({
        message:
          "Seller is pending approval or has not accepted terms and condition",
      });
    }
    res.status(201).json(seller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Seller update profile

// Seller update profile
exports.sellerUpdateProfile = async (req, res) => {
  const sellerId = req.params.id;

  // Allowed fields for update
  const allowedFields = ["email", "name", "desc", "logo"];

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
    // Retrieve the existing seller document
    const existingSeller = await Seller.findById(sellerId);
    if (!existingSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (
      existingSeller.pending === true ||
      existingSeller.acceptedTerms === false
    ) {
      return res.status(401).json({ message: "Seller is pending approval" });
    }
    // Proceed with the update
    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      filteredBody,
      { new: true, runValidators: true }
    );
    updatedSeller.pass = undefined;
    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// admin delete seller requesting deletion
exports.deleteSellersRequestingDeletion = async (req, res) => {
  // middleware auth
  try {
    const sellers = await Seller.find({ requestingDeletion: true });

    if (sellers.length === 0) {
      return res
        .status(404)
        .json({ message: "No sellers found requesting deletion" });
    }

    for (const seller of sellers) {
      await Seller.findByIdAndDelete(seller._id);
    }

    res.status(200).json({ message: "Sellers deleted successfully" });
  } catch (error) {
    console.error("Error deleting sellers:", error);
    res.status(500).json({ error: error.message });
  }
};

//seller requests to be deleted
exports.sellerDeleteHimself = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    if (seller.pending === true || seller.acceptedTerms === false) {
      return res.status(400).json({ message: "Seller is pending approval" });
    }
    if (seller.requestingDeletion === true) {
      return res
        .status(400)
        .json({ message: "Seller has already requested to be deleted" });
    }
    seller.requestingDeletion = true;
    await seller.save();
    const result = await Product.updateMany(
      { sellerId: req.params.id },
      { $set: { hidden: true } }
    );
    res.status(200).json({ message: "Request to be deleted successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminDeletesSellers = async (req, res) => {
  const sellerIds = req.body.sellerIds;
  if (!sellerIds || !sellerIds.length) {
    return res.status(400).json({ error: "Seller IDs are required" });
  }
  try {
    const result = await Seller.deleteMany({
      _id: { $in: sellerIds },
      requestingDeletion: true,
    });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "sellers selected were not requesting deletion" });
    }
    res.status(200).json({ message: "Sellers deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.adminDeletesSellerFromSystem = async (req, res) => {
  const sellerId = req.params.id;
  if (!sellerId) {
    return res.status(400).json({ error: "Seller ID is required" });
  }
  try {
    const result = await Product.updateMany(
      { sellerId: sellerId }, // Find all activities with this sellerId
      { $set: { hidden: true } } // Set hidden field to true
    );
    const deletedseller = await Seller.findByIdAndDelete(sellerId);
    if (!deletedseller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json({ message: "Seller deleted successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptTerms = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Seller.findById(id);
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

//uploadLogo for specific seller
exports.uploadSellerLogo = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);
    const logo = req.body.logo;
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    seller.logo = logo;
    await seller.save();
    res.status(200).json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get seller documents
exports.getSellerDocuments = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select(
      "id taxationRegCard"
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const response = {
      message: "Documents retrieved successfully",
      id: seller.id || null,
      taxationRegCard: seller.taxationRegCard || null,
    };

    if (!seller.id) {
      response.idMessage = "No ID uploaded by this seller";
    }

    if (!seller.taxationRegCard) {
      response.taxationRegCardMessage =
        "No taxation registration card uploaded by this seller";
      response.taxationRegCard = null;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//admin accept seller
exports.acceptSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (!seller.pending) {
      return res
        .status(400)
        .json({ message: "Seller is not in a pending state" });
    }

    seller.pending = false;
    await seller.save();

    res.status(200).json({ message: "Seller accepted successfully", seller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//admin reject seller (deletes seller upon rejection)
exports.rejectSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (!seller.pending) {
      return res
        .status(400)
        .json({ message: "Seller is not in a pending state" });
    }

    const deletedSeller = await Seller.findByIdAndDelete(sellerId);

    res.status(200).json({
      message: "Seller rejected and deleted successfully",
      //sellerId: deletedSeller._id, // You can return the deleted seller's ID if needed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestDeletion = async (req, res) => {
  try {
    const sellerId = req.params.id; // Assuming seller ID is passed as a parameter

    // Find the seller by ID
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Set the requestingDeletion field to true
    seller.requestingDeletion = true;
    await seller.save();

    res.status(200).json({ message: "Seller deletion requested successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
