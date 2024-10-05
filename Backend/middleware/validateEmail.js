const validateEmail = (req, res, next) => {
    const email = req.body.email;

    if(!email) {
      return next();
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  
    next();
  };
  
  module.exports = validateEmail;
  