const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const { uploadUserFiles } = require('../middleware/upload');

// Admin-only actions
router.get('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.getAllUsers);
router.get('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.getUserById);

// Create user with file uploads
router.post('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), uploadUserFiles, userController.createUser);

// Update user with file uploads
router.patch('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), uploadUserFiles, userController.updateUser);

router.patch('/:id/role', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), userController.updateUserRole);

router.patch('/:id/block', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.blockUser);
router.patch('/:id/unblock', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.unblockUser);

// Soft delete
router.delete('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), userController.softDeleteUser);

// Hard delete
router.delete('/:id/hard', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), userController.deleteUser);

module.exports = router;
