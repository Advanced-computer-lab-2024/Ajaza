const jwt = require('jsonwebtoken');

// Utility: Decode JWT and set user ID (middleware)
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'security_key'); // Ensure the secret key matches
        req.user = decoded; // Set decoded token data (e.g., userId) in the request object
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
