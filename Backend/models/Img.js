const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
  dummy: { type: Boolean, default: true }, // Indicates if this is a dummy image
});

// Create the model
const Img = mongoose.model('Img', imgSchema);

module.exports = Img;
