const Ticket = require('../models/Ticket');
const TicketMessage = require('../models/TicketMessage');
const User = require('../models/User');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Create ticket (Student/Employer)
 * POST /api/tickets
 * body: { sourceType, subject, category, priority, linkedJobId?, companyId? , messageText, attachments? }
 */
exports.createTicket = async (req, res) => {
  try {
    const { sourceType, subject, category, priority, linkedJobId, companyId, messageText, attachments } = req.body;
    if (!sourceType || !subject) return res.status(400).json({ message: 'Missing fields' });

    const ticket = new Ticket({
      ticketId: `T-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*9000)+1000}`,
      sourceType,
      createdByUserId: req.user.id,
      companyId: companyId || null,
      subject,
      category,
      priority: priority || 'normal',
      linkedJobId: linkedJobId || null,
      lastMessageAt: new Date()
    });
    await ticket.save();

    if (messageText || (attachments && attachments.length)) {
      const msg = new TicketMessage({
        ticketId: ticket._id,
        senderType: sourceType,
        senderUserId: req.user.id,
        messageText: messageText || '',
        attachments: attachments || []
      });
      await msg.save();
    }

    // return created ticket (light)
    return res.status(201).json({ message: 'Ticket created', ticketId: ticket._id, ticket });
  } catch (err) {
    console.error('createTicket error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * User ticket list
 * GET /api/tickets/my
 * returns tickets createdBy current user
 */
exports.getMyTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Math.max(1, page) - 1) * limit;
    const tickets = await Ticket.find({ createdByUserId: req.user.id, /*exclude deleted if any*/ })
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    return res.json(tickets);
  } catch (err) {
    console.error('getMyTickets error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get ticket detail (messages)
 * GET /api/tickets/:id
 */
exports.getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Fetch ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Fetch messages (including internal notes initially)
    let messages = await TicketMessage.find({ ticketId }).sort({ createdAt: 1 });

    // ROLE-BASED FILTERING
    const role = req.user.role;

    const isAdmin = role === "SUPER_ADMIN" || role === "SUPPORT_ADMIN";

    if (!isAdmin) {
      // Student / Employer → hide internal notes
      messages = messages.filter(msg => msg.isInternalNote !== true);
    }

    return res.json({
      ticket,
      messages
    });

  } catch (err) {
    console.error("Error fetching ticket:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * Post a message to ticket
 * POST /api/tickets/:id/message
 * body: { messageText, attachments, isInternalNote? }
 */
exports.postMessage = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { messageText, attachments, isInternalNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) return res.status(400).json({ message: 'Invalid id' });

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // permissions:
    const senderType = req.user.role === 'EMPLOYER' ? 'employer' : (req.user.role === 'STUDENT' ? 'student' : 'admin');

    // if isInternalNote true, only allow admin
    if (isInternalNote && !['SUPER_ADMIN','ADMIN','SUPPORT_ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden - internal notes are admin only' });
    }

    const msg = new TicketMessage({
      ticketId: ticket._id,
      senderType,
      senderUserId: req.user.id,
      messageText: messageText || '',
      attachments: attachments || [],
      isInternalNote: !!isInternalNote
    });

    await msg.save();

    // update ticket status & lastMessageAt
    ticket.lastMessageAt = new Date();
    // if admin sent message -> IN_PROGRESS
    if (['SUPER_ADMIN','ADMIN','SUPPORT_ADMIN'].includes(req.user.role)) {
      ticket.status = 'IN_PROGRESS';
    } else {
      // if user replies to admin waiting => flip to IN_PROGRESS
      if (ticket.status === 'WAITING_FOR_STUDENT' || ticket.status === 'WAITING_FOR_EMPLOYER') {
        ticket.status = 'IN_PROGRESS';
      }
    }
    await ticket.save();

    return res.status(201).json({ message: 'Message posted', msg });
  } catch (err) {
    console.error('postMessage error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ADMIN: list tickets with filters
 * GET /api/admin/tickets?status=&priority=&sourceType=&age=&assigned=
 */
exports.adminListTickets = async (req, res) => {
  try {
    const { status, priority, sourceType, assigned, search, page = 1, limit = 30, age } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (sourceType) filter.sourceType = sourceType;
    if (assigned) filter.assignedAdminId = assigned;
    if (search) filter.$or = [{ subject: new RegExp(search, 'i') }, { ticketId: new RegExp(search, 'i') }];

    // age filter e.g., >48h -> convert to date
    if (age) {
      const hours = parseInt(age, 10);
      if (!isNaN(hours)) {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000);
        filter.createdAt = { $lte: since };
      }
    }

    const skip = (Math.max(1, page) - 1) * limit;
    const total = await Ticket.countDocuments(filter);
    const tickets = await Ticket.find(filter)
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    return res.json({ total, page: Number(page), limit: Number(limit), tickets });
  } catch (err) {
    console.error('adminListTickets error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ADMIN: change status
 * PUT /api/admin/tickets/:id/status { status: 'IN_PROGRESS' }
 */
exports.adminChangeStatus = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(ticketId)) return res.status(400).json({ message: 'Invalid id' });

    const allowed = ['OPEN','IN_PROGRESS','WAITING_FOR_STUDENT','WAITING_FOR_EMPLOYER','RESOLVED','CLOSED'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const ticket = await Ticket.findByIdAndUpdate(ticketId, { status, updatedAt: new Date(), ...(status === 'RESOLVED' ? { closedAt: new Date() } : {}) }, { new: true }).lean();
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    return res.json({ message: 'Status updated', ticket });
  } catch (err) {
    console.error('adminChangeStatus error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ADMIN: assign ticket
 * PUT /api/admin/tickets/:id/assign { adminId: '...' }
 */
exports.adminAssign = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { adminId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(ticketId)) return res.status(400).json({ message: 'Invalid ticket id' });

    // validate adminId
    if (adminId && !mongoose.Types.ObjectId.isValid(adminId)) return res.status(400).json({ message: 'Invalid admin id' });

    // optional: check admin exists and has admin role
    if (adminId) {
      const adminUser = await User.findById(adminId).lean();
      if (!adminUser) return res.status(404).json({ message: 'Admin user not found' });
      if (!['SUPER_ADMIN','ADMIN','SUPPORT_ADMIN'].includes(adminUser.role)) {
        return res.status(400).json({ message: 'User is not an admin' });
      }
    }

    const ticket = await Ticket.findByIdAndUpdate(ticketId, { assignedAdminId: adminId || null, updatedAt: new Date() }, { new: true }).lean();
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    return res.json({ message: 'Assigned', ticket });
  } catch (err) {
    console.error('adminAssign error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
