const validatePhoneNumber = (req, res, next) => {
    const phoneNumber = req.body.mobile;

    if(!phoneNumber) {
      return next();
    }
  
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }
  
    next();
  };
  
  module.exports = validatePhoneNumber;
  