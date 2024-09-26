const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({ //an event is an activity
  advertiserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Advertiser' }, // Reference to the advertiser
  name: { type: String, required: true},
  date: { type: Date, required: true }, // Date of the activity
  location: { type: String, required: true }, // Google Maps link or location description
  upper: { type: Number, required: true }, // Upper limit of pricing or capacity
  lower: { type: Number, required: true }, // Lower limit (equal to upper if not a range)
  category: { type: String, required: true }, // Activity category
  tags: [{ type: String }], // Array of tags related to the activity, advertiser enters them as he wants
  discounts: { type: String }, // TODO
  isOpen: { type: Boolean, default: true }, // Booking availability
  flagged: { type: Boolean, default: false }, // Flag status for inappropriate content, delete from database after sending notification
  feedback: [
    {
      rating: { type: Number, min: 1, max: 5 }, // Rating between 1 and 5
      comments: { type: String },
    },
  ],
});

// Create the model
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
