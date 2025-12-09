const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketSchema = new Schema({
  ticketId: { type: String, index: true }, // optional readable id
  sourceType: { type: String, enum: ['student','employer'], required: true, index: true },
  createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' }, // optional
  subject: { type: String, required: true, index: 'text' },
  category: { type: String, index: true },
  priority: { type: String, enum: ['low','normal','high','urgent'], default: 'normal', index: true },
  status: {
    type: String,
    enum: ['OPEN','IN_PROGRESS','WAITING_FOR_STUDENT','WAITING_FOR_EMPLOYER','RESOLVED','CLOSED'],
    default: 'OPEN',
    index: true
  },
  linkedJobId: { type: Schema.Types.ObjectId, ref: 'Job' },
  assignedAdminId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  lastMessageAt: { type: Date, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  closedAt: Date,
  meta: Schema.Types.Mixed // for extra small metadata
}, { timestamps: true });

TicketSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
