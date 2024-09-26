const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }, // hashed password
  id: { type: String, required: true }, // serialized number for the guide's image
  certificates: [{ type: String }], // array of serialized certificate images
  pending: { type: Boolean, default: true }, // initially true until admin approves
  mobile: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  previousWork: [{ type: String }], // array of previous job titles
  photo: { type: String, required: true }, // serialized number for photo
  acceptedTerms: { type: Boolean, default: false }, // initially false until accepted
  notifications: [
    {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
    },
  ],
  feedback: [
    {
      rating: { type: Number, min: 1, max: 5 }, // rating between 1 and 5
      comments: { type: String },
    },
  ],
});

// Create the model
const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
