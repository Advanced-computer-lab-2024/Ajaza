const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  governorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Governor' }, // Reference to the governor who created the venue
  name: { type: String, required: true }, // Name of the venue
  desc: { type: String, required: true }, // Description of the venue
  pictures: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'}], // Array of picture paths or URLs
  location: { type: String, required: true }, // Google Maps link or address
  openingHours: {
    suno: { type: Number, required: true }, // Opening hour on Sunday
    sunc: { type: Number, required: true }, // Closing hour on Sunday
    mono: { type: Number, required: true },
    monc: { type: Number, required: true },
    tueo: { type: Number, required: true },
    tuec: { type: Number, required: true },
    wedo: { type: Number, required: true },
    wedc: { type: Number, required: true },
    thuo: { type: Number, required: true },
    thuc: { type: Number, required: true },
    frio: { type: Number, required: true },
    fric: { type: Number, required: true },
    sato: { type: Number, required: true },
    satc: { type: Number, required: true }
  },
  price: {
    foreigner: { type: Number, required: true }, // Price for foreigners
    native: { type: Number, required: true }, // Price for natives
    student: { type: Number, required: true }, // Price for students
  },
  tags: [{ type: String, enum:['Monuments', 'Museums', 'Religioud Sites', 'Palaces/Castles'] }], // Array of tags related to the venue, from the limited list given in description
});

// Create the model
const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
