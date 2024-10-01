const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
  dummy: { type: Boolean, default: true }, // Indicates if this is a dummy image
  originalName: { type: String}, // Original name of the uploaded file
  path: { type: String}, // Path where the file is stored
  createdAt: { type: Date, default: Date.now } // Date when the image was uploaded
});

// Create the model
const Img = mongoose.model('Img', imgSchema);

module.exports = Img;
