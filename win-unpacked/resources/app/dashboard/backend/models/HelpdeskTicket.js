import mongoose from 'mongoose';

const helpdeskTicketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now },
  chatMessages: [
    {
      sender: { type: String, required: true },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const HelpdeskTicket = mongoose.model('HelpdeskTicket', helpdeskTicketSchema);

export default HelpdeskTicket;
