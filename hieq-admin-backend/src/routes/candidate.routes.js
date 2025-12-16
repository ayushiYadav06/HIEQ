const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const candidateController = require('../controllers/candidate.controller');
const { uploadUserFiles } = require('../middleware/upload');

// Get all candidates
router.get('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.getAllCandidates);

// Bulk create candidates from CSV (MUST be before /:id route)
router.post('/bulk', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.bulkCreateCandidates);

// Create candidate with file uploads
router.post('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), uploadUserFiles, candidateController.createCandidate);

// Get candidate by ID
router.get('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.getCandidateById);

// All specific PATCH routes MUST be before the generic PATCH /:id route
// Change password - MUST be before generic PATCH /:id to avoid route matching issues
router.patch('/:id/change-password', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.changePassword);

// Update document status
router.patch('/:id/document-status', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.updateDocumentStatus);

// Block/Unblock candidate
router.patch('/:id/block', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.blockCandidate);
router.patch('/:id/unblock', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.unblockCandidate);

// Update candidate with file uploads (generic route - must be last)
router.patch('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), uploadUserFiles, candidateController.updateCandidate);

// Soft delete
router.delete('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN'), candidateController.softDeleteCandidate);

// Send password reset email
router.post('/:id/send-reset-password', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.sendPasswordResetEmail);

// Send email verification link
router.post('/:id/send-verification', auth.verifyToken, auth.requireRole('SUPER_ADMIN', 'ADMIN'), candidateController.sendEmailVerificationLink);

// Verify email (Public endpoint - users click from email)
router.post('/:id/verify-email', candidateController.verifyEmail);

module.exports = router;

