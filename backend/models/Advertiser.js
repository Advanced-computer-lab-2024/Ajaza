const mongoose = require('mongoose');

const advertiserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }, // hashed password
  id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'}, // serialized number for image beta2a
  taxationRegCard: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'}, // serialized number for taxation registration card
  pending: { type: Boolean, default: true }, // initially true until admin approves
  link: { type: String, required: true },
  hotline: { type: String, required: true },
  companyProfile: { //mainly a description
    name: { type: String, required: true },
    desc: { type: String, required: true },
    location: { type: String, required: true },
  },
  logo: { type: mongoose.Schema.Types.ObjectId, ref: 'Img'}, // serialized number for logo
  acceptedTerms: { type: Boolean, default: false }, // initially false until accepted
  notifications: [
    {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
    },
  ],
  requestingDeletion: { type: Boolean, default: false}
});

// Create the model
const Advertiser = mongoose.model('Advertiser', advertiserSchema);

module.exports = Advertiser;
