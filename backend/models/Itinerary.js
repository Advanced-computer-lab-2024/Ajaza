const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  guideId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Guide' }, // Reference to the guide
  name: { type: String, required: true},
  timeline: [
    {
      start: { type: Number, required: true }, // start time in 24h format
      id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to Activity or Venue
      type: { type: String, enum: ['Activity', 'Venue'], required: true }, // To indicate whether it is an Activity or Venue
      duration: { type: Number, required: true }, // Duration of the activity
    },
  ],
  language: { type: String, required: true }, // Language for the itinerary
  price: { type: Number, required: true }, // Total price for the itinerary
  availableDateTime: [
    {
      date: { type: Date, required: true },
      spots: { type: Number, default: 20}
    }
  ], // Array of available date and time
  accessibility: { type: String }, // wheel chair accessible, audio tour, railings
  pickUp: { type: String, required: true }, // Pickup location
  dropOff: { type: String, required: true }, // Drop-off location
  active: { type: Boolean, default: true }, // Active status for the itinerary, guide can deactivate
  feedback: [
    {
      rating: { type: Number, min: 1, max: 5 ,required: true }, // Rating between 1 and 5
      comments: { type: String ,required: true },
    },
  ],
  maxTourists: { type: Number, required: true, default: 20},
  hidden: { type:Boolean, default: false}
});

// Create the model
const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
