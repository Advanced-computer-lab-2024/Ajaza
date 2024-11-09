const Admin = require('../models/Admin'); // Adjust path as necessary
const Tourist = require('../models/Tourist'); // Adjust path as necessary
const Advertiser = require('../models/Advertiser'); // Adjust path as necessary
const Seller = require('../models/Seller'); // Adjust path as necessary
const Guide = require('../models/Guide'); // Adjust path as necessary
const Governor = require('../models/Governor'); // Adjust path as necessary

const checkUsernameAvailability = async (req, res, next) => {
  const { username } = req.body; // Assuming username is passed in the request body

  if (!username) {
    return next();
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
      return res.status(400).json({ error: 'Username is already taken' });
      
    }

    next(); // Proceed to the next middleware or route handler if username is available
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkUsernameAvailability;
