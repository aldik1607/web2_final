// Simple validation middleware

// Validate registration data
exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  if (!email || !email.includes('@')) {
    errors.push('Please provide a valid email');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

// Validate login data
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  next();
};

// Validate product data
exports.validateProduct = (req, res, next) => {
  const { name, description, price } = req.body;
  const errors = [];

  if (!name || name.length < 2) {
    errors.push('Product name is required');
  }

  if (!description) {
    errors.push('Description is required');
  }

  if (!price || price < 0) {
    errors.push('Valid price is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};
