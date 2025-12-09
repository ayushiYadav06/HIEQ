const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// public
router.post('/register', authController.register); // optionally restrict
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
