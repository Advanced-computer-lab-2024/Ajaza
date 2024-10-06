const Tourist = require('../models/Tourist'); // Adjust path as necessary
const Guide = require('../models/Guide'); // Adjust path as necessary

const checkMobileAvailability = async (req, res, next) => {
  const { mobile } = req.body; // Assuming username is passed in the request body

  if (!mobile) {
    return next();
  }

  try {
    // Check each collection for the username
    const touristExists = await Tourist.exists({ mobile });
    const guideExists = await Guide.exists({ mobile });

    if (touristExists || guideExists) {
      return res.status(400).json({ error: 'mobile is already associated to an account' });
    }

    next(); // Proceed to the next middleware or route handler if username is available
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = checkMobileAvailability;
