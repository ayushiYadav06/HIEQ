const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// test protected route
router.get('/dashboard', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN'), (req, res) => {
  res.json({
    message: 'Welcome to HIEQ Admin Dashboard',
    user: req.currentUser || req.user
  });
});

module.exports = router;
