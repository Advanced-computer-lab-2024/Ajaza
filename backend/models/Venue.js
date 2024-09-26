const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  governorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Governor' }, // Reference to the governor who created the venue
  name: { type: String, required: true }, // Name of the venue
  desc: { type: String, required: true }, // Description of the venue
  pictures: [{ type: String }], // Array of picture paths or URLs
  location: { type: String, required: true }, // Google Maps link or address
  openingHours: {
    suno: { type: Number, required: true }, // Opening hour on Sunday
    sunc: { type: Number, required: true }, // Closing hour on Sunday
  },
  price: {
    foreigner: { type: Number, required: true }, // Price for foreigners
    native: { type: Number, required: true }, // Price for natives
    student: { type: Number, required: true }, // Price for students
  },
  tags: [{ type: String }], // Array of tags related to the venue, from the limited list given in description
});

// Create the model
const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
