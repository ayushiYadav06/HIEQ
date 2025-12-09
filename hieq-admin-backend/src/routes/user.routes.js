const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controller');

// Admin-only actions
router.get('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.getAllUsers);
router.get('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.getUserById);

router.patch('/:id/role', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), userController.updateUserRole);

router.patch('/:id/block', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.blockUser);
router.patch('/:id/unblock', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.unblockUser);

router.delete('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), userController.softDeleteUser);

module.exports = router;
