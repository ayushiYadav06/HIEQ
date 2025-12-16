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

// Bulk create users from CSV
router.post('/bulk', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.bulkCreateUsers);

// Hard delete
router.delete('/:id/hard', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), userController.deleteUser);

// Change password
router.patch('/:id/change-password', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.changePassword);

// Send password reset email
router.post('/:id/send-reset-password', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.sendPasswordResetEmail);

// Send email verification link
router.post('/:id/send-verification', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.sendEmailVerificationLink);

// Verify email (Public endpoint - users click from email)
router.post('/:id/verify-email', userController.verifyEmail);

// Update document status
router.patch('/:id/document-status', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), userController.updateDocumentStatus);

module.exports = router;
