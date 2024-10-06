const Tourist = require('../models/Tourist'); // Adjust path as necessary
const Advertiser = require('../models/Advertiser'); // Adjust path as necessary
const Seller = require('../models/Seller'); // Adjust path as necessary
const Guide = require('../models/Guide'); // Adjust path as necessary

const checkEmailAvailability = async (req, res, next) => {
  const { email } = req.body; // Assuming username is passed in the request body

  if (!email) {
    return next();
  }

  try {
    // Check each collection for the username
    const touristExists = await Tourist.exists({ email });
    const advertiserExists = await Advertiser.exists({ email });
    const sellerExists = await Seller.exists({ email });
    const guideExists = await Guide.exists({ email });

    if (touristExists || advertiserExists || sellerExists || guideExists) {
      return res.status(400).json({ error: 'Email is already associated to an account' });
    }

    next(); // Proceed to the next middleware or route handler if username is available
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkEmailAvailability;
