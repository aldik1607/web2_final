const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Admin or moderator middleware
const adminOrModerator = (req, res, next) => {
  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin or moderator access required' });
  }
  next();
};

module.exports = { protect, adminOnly, adminOrModerator };
