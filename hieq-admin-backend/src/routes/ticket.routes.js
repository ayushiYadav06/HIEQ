const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ticketController = require('../controllers/ticket.controller');

// create ticket (student/employer)
router.post('/', auth.verifyToken, ticketController.createTicket);

// get my tickets
router.get('/my', auth.verifyToken, ticketController.getMyTickets);

// get detail (owner or admin)
router.get('/:id', auth.verifyToken, ticketController.getTicketById);

// post message to ticket (owner or admin)
router.post('/:id/message', auth.verifyToken, ticketController.postMessage);

module.exports = router;
