const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketMessageSchema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true, index: true },
  senderType: { type: String, enum: ['student','employer','admin'], required: true },
  senderUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageText: { type: String },
  attachments: [{ url: String, name: String, mime: String }],
  isInternalNote: { type: Boolean, default: false }, // admin-only notes
  createdAt: { type: Date, default: Date.now, index: true }
});

TicketMessageSchema.index({ ticketId: 1, createdAt: 1 });

module.exports = mongoose.models.TicketMessage || mongoose.model('TicketMessage', TicketMessageSchema);
