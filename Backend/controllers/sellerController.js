const Seller = require("../models/Seller");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Tourist = require("../models/Tourist");
const Advertiser = require("../models/Advertiser");
const Guide = require("../models/Guide");
const Governor = require("../models/Governor");

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

exports.getAcceptedSellers = async(req, res) => {
  try {
    const sellers = await Seller.find({ pending: false });
    res.status(200).json(sellers);
  } catch (error) {
    console.error("Error fetching accepted sellers:", error);
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

    // Create new seller
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
  const filteredBody = req.body; /*{};
  allowedFields.forEach((field) => {
    // Loop through the allowed fields
    if (req.body[field] !== undefined) {
      // Check if the field exists in the request body
      filteredBody[field] = req.body[field]; // Add the field to the filtered body
    }
  });*/

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

    const token = jwt.sign(
      { userId: updatedSeller._id, role: "seller", userDetails: updatedSeller }, // Include user data in the token
      process.env.JWT_SECRET, // Use the environment variable
      { expiresIn: "1h" }
    );

    res.status(200).json({ updatedSeller, token });
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
// exports.getSellerDocuments = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.params.id).select(
//       "id taxationRegCard"
//     );

//     if (!seller) {
//       return res.status(404).json({ message: "Seller not found" });
//     }

//     const response = {
//       message: "Documents retrieved successfully",
//       id: seller.id || null,
//       taxationRegCard: seller.taxationRegCard || null,
//     };

//     if (!seller.id) {
//       response.idMessage = "No ID uploaded by this seller";
//     }

//     if (!seller.taxationRegCard) {
//       response.taxationRegCardMessage =
//         "No taxation registration card uploaded by this seller";
//       response.taxationRegCard = null;
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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

// returns all sellers that are pending
exports.getPendingSellers = async (req, res) => {
  try {
    // Fetch advertisers with pending status
    const pendingSellers = await Seller.find({ pending: true }).exec();

    // if (pendingSellers.length === 0) {
    //   return res.status(404).json({ message: "No Sellers with pending status found." });
    // }

    // Return the found pending advertisers
    res.status(200).json(pendingSellers);
  } catch (error) {
    console.error("Error fetching pending sellers:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingAdvertisers = async (req, res) => {
  try {
    // Fetch advertisers with pending status
    const pendingAdvertisers = await Advertiser.find({ pending: true }).exec();

    if (pendingAdvertisers.length === 0) {
      return res
        .status(404)
        .json({ message: "No advertisers with pending status found." });
    }

    // Return the found pending advertisers
    res.status(200).json(pendingAdvertisers);
  } catch (error) {
    console.error("Error fetching pending advertisers:", error);
    res.status(500).json({ error: error.message });
  }
};

//returns details to be displayed.
exports.getSellerDetails = async (req, res) => {
  const sellerId = req.params.id;

  try {
    // Find the advertiser by ID and populate image references
    const seller = await Seller.findById(sellerId)
      .populate({ path: "id", select: "_id" }) // Populate with _id to construct the image path
      .populate({ path: "taxationRegCard", select: "_id" })
      .populate({ path: "logo", select: "_id" })
      .exec();

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Construct the response object with image paths for ID and Taxation Registration Card
    const responseSeller = {
      id: seller.id ? `uploads/${seller.id._id}.jpg` : null,
      taxationRegCard: seller.taxationRegCard
        ? `uploads/${seller.taxationRegCard._id}.jpg`
        : null,
      // logo: advertiser.logo ? `uploads/${advertiser.logo._id}.jpg` : null,
      username: seller.username,
      email: seller.email,
      link: seller.link || null,
      hotline: seller.hotline || null,
      companyProfile: {
        name: seller.companyProfile?.name || null,
        desc: seller.companyProfile?.desc || null,
        location: seller.companyProfile?.location || null,
      },
      pending: seller.pending,
      acceptedTerms: seller.acceptedTerms,
      requestingDeletion: seller.requestingDeletion || false,
    };

    // Return the seller details excluding sensitive information
    res.status(200).json(responseSeller);
  } catch (error) {
    console.error("Error fetching seller details:", error);
    res.status(500).json({ error: error.message });
  }
};

//req 28 - tatos (Not Done Yet)

// exports.viewSalesReport = async (req, res) => {
//   const sellerId = req.params.id;
//   try {
//     // Check if the seller exists
//     const seller = await Seller.findById(sellerId);
//     if (!seller) {
//       return res.status(404).json({ message: "Seller not found" });
//     }
//     if (seller.pending) {
//       return res.status(401).json({ message: "Waiting for admin approval" });
//     }
//     if (!seller.acceptedTerms) {
//       return res.status(401).json({ message: "Terms and Conditions must be accepted" });
//     }
//     if(seller.requestingDeletion){
//       return res.status(401).json({ message: "Seller is requesting deletion" });
//     }
//     // Find all tourists
//     const tourists = await Tourist.find();

//     let orders = [];

//     // Iterate through each tourist to find orders matching the sellerId
//     tourists.forEach(tourist => {
//       const matchingOrders = tourist.orders.filter(order => order.sellerId === sellerId);
//       orders = orders.concat(matchingOrders);
//     });

//     // Log the orders found
//     console.log('Orders found:', orders);

//     // Calculate the total sales by multiplying the price by the quantity for each order
//     const totalSales = orders.reduce((total, order) => total + (order.price * order.quantity), 0);

//     const salesDetails = orders.map(order => ({
//       productName: order.productName,
//       dateOfOrder: order.dateOfOrder,
//       quantity: order.quantity,
//       price: order.price
//     }));

//     // Log the total sales and sales details
//     console.log('Total Sales:', totalSales);
//     console.log('Sales Details:', salesDetails);

//     // Return the total sales and additional details
//     res.status(200).json({ totalSales, salesDetails });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//method 2: (incorrect but works for now):
exports.viewSalesReport = async (req, res) => {
  sellerId = req.params.id;
  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    if (seller.pending) {
      return res.status(401).json({ message: "Seller is pending approval" });
    }
    if (!seller.acceptedTerms) {
      return res
        .status(401)
        .json({ message: "Seller has not accepted terms and conditions" });
    }
    if (seller.requestingDeletion) {
      return res.status(401).json({ message: "Seller is requesting deletion" });
    }

    // Find all products sold by the seller
    const products = await Product.find({ sellerId: sellerId });
    console.log(products); // Log the products found

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }
    let totalSales = 0;
    let salesDetails = [];
    for (const product of products) {
      if (product.sales > 0) {
        totalSales += product.sales * product.price;
        salesDetails.push({
          productName: product.name,
          sales: product.sales,
          price: product.price,
          sellerName: product.sellerName,
        });
      }
    }
    res.status(200).json({ totalSales, salesDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.seeNotifications = async(req,res) => {
  try {
    const userId = req.params.id;

    const user = await Seller.findById(userId);

    if(!user) {
      return res.status(404).json({message: "User not found"});
    }

    for(let i = 0; i < user.notifications.length; i++) {
      user.notifications[i].seen = true;
    }

    await user.save();

    return res.status(200).json({message: "Notifications seen successfully"});
  }
  catch(error) {
    return res.status(500).json({message: "Internal error"});
  }
}

exports.myItemsFeedback = async(req,res) => {
  try {
    const sellerId = req.params.id;

    const products = await Product.find({ sellerId });

    const allFeedback = products.reduce((acc, product) => {
      return acc.concat(product.feedback);
    }, []);

    return { message: "Feedback returned successfully.", feedback: allFeedback };
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}