const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  guideId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Guide' }, // Reference to the guide
  name: { type: String, required: true},
  activities: [
    {
      start: { type: Number, required: true},
      id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Activity' }, // Reference to the activity
      duration: { type: Number, required: true }, // Duration of the activity
    },
  ],
  venues: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Venue' }], // Array of venue IDs
  //timeline: { type: String }, // Description or structure of the timeline (needs clarification)
  language: { type: String, required: true }, // Language for the itinerary
  price: { type: Number, required: true }, // Total price for the itinerary
  availableDateTime: [
    {
      date: { type: Date, required: true },
      spotsAvailable: { type: Number, default: 20}
    }
  ], // Array of available date and time
  accessibility: { type: String }, // wheel chair accessible, audio tour, railings
  pickUp: { type: String, required: true }, // Pickup location
  dropOff: { type: String, required: true }, // Drop-off location
  active: { type: Boolean, default: true }, // Active status for the itinerary, guide can deactivate
  flagged: { type: Boolean, default: false }, // Flag status for inappropriate content, delete from database after sending notification
  feedback: [
    {
      rating: { type: Number, min: 1, max: 5 }, // Rating between 1 and 5
      comments: { type: String },
    },
  ],
  maxTourists: { type: Number, required: true, default: 20}
});

// Create the model
const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
