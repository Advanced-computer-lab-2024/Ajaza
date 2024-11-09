const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' }, // Reference to the tourist making the complaint
  title: { type: String, required: true }, // Title of the complaint
  body: { type: String, required: true }, // Detailed description of the complaint
  date: { type: Date, default: Date.now }, // Date the complaint was made
  pending: { type: Boolean, default: true }, // Indicates if the complaint is pending resolution
  replies: [
    {
      name: { type: String, required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

// Create the model
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
