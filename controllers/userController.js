const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true }
    );

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
