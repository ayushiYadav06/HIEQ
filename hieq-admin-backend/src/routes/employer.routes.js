const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const employerController = require('../controllers/employer.controller');
const { uploadUserFiles } = require('../middleware/upload');

// Get all employers
router.get('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.getAllEmployers);

// Bulk create employers from CSV (MUST be before /:id route)
router.post('/bulk', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.bulkCreateEmployers);

// Create employer with file uploads
router.post('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), uploadUserFiles, employerController.createEmployer);

// Get employer by ID
router.get('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.getEmployerById);

// All specific PATCH routes MUST be before the generic PATCH /:id route
// Change password
router.patch('/:id/change-password', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.changePassword);

// Update document status
router.patch('/:id/document-status', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.updateDocumentStatus);

// Block/Unblock employer
router.patch('/:id/block', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.blockEmployer);
router.patch('/:id/unblock', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.unblockEmployer);

// Update employer with file uploads (generic route - must be last)
router.patch('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), uploadUserFiles, employerController.updateEmployer);

// Soft delete
router.delete('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), employerController.softDeleteEmployer);

// Send password reset email
router.post('/:id/send-reset-password', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.sendPasswordResetEmail);

// Send email verification link
router.post('/:id/send-verification', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), employerController.sendEmailVerificationLink);

// Verify email (Public endpoint - users click from email)
router.post('/:id/verify-email', employerController.verifyEmail);

module.exports = router;

