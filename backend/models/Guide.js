const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }, // hashed password
  id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'}, // serialized number for beta2a
  certificates: [{ type: String }], // array of serialized certificate images
  pending: { type: Boolean, default: true }, // initially true until admin approves
  mobile: { type: String, required: true },
  yearsOfExperience: { type: Number},
  previousWork: [{ type: String }], // array of previous job titles
  photo: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'} , // serialized number for personal photo
  acceptedTerms: { type: Boolean, default: false }, // initially false until accepted
  notifications: [
    {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
    },
  ],
  feedback: [
    {
      rating: { type: Number, min: 1, max: 5, required: true }, // rating between 1 and 5
      comments: { type: String, required: true },
    },
  ],
  requestingDeletion: { type:Boolean, default: false}
});

// Create the model
const Guide = mongoose.model('Guide', guideSchema);

module.exports = Guide;
