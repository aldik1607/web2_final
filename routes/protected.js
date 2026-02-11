const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected - require valid JWT
router.use(protect);

// GET /api/protected/profile - example private endpoint
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected endpoint',
    user: req.user
  });
});

// GET /api/protected/dashboard - another private endpoint
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: `Welcome to your dashboard, ${req.user.name || req.user.email}!`
  });
});

module.exports = router;
