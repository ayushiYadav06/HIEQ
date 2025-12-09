const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ticketController = require('../controllers/ticket.controller');

// admin-only ticket management
router.get('/', auth.verifyToken, auth.requireRole('SUPER_ADMIN','ADMIN','SUPPORT_ADMIN'), ticketController.adminListTickets);
router.get('/:id', auth.verifyToken, auth.requireRole('SUPER_ADMIN','ADMIN','SUPPORT_ADMIN'), ticketController.getTicketById);
router.put('/:id/status', auth.verifyToken, auth.requireRole('SUPER_ADMIN','ADMIN','SUPPORT_ADMIN'), ticketController.adminChangeStatus);
router.put('/:id/assign', auth.verifyToken, auth.requireRole('SUPER_ADMIN','ADMIN','SUPPORT_ADMIN'), ticketController.adminAssign);

module.exports = router;
