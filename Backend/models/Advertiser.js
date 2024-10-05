const mongoose = require('mongoose');

const advertiserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }, // hashed password
  id: { type: mongoose.Schema.Types.ObjectId, ref: 'Img'}, // serialized number for image beta2a //make this required after ensuring uploading image is working
  taxationRegCard: { type: mongoose.Schema.Types.ObjectId, ref: 'Img'}, // serialized number for taxation registration card //make this required after ensuring uploading image is working
  pending: { type: Boolean, default: true }, // initially true until admin approves
  link: { type: String, required: false },
  hotline: { type: String, required: false },
  companyProfile: { //mainly a description
    name: { type: String, required: false },
    desc: { type: String, required: false },
    location: { type: String, required: false },
  },
  logo: { type: mongoose.Schema.Types.ObjectId, ref: 'Img'}, // serialized number for logo
  acceptedTerms: { type: Boolean, default: false }, // initially false until accepted
  notifications: [
    {
      text: { type: String, required: false },
      seen: { type: Boolean, default: false },
    },
  ],
  requestingDeletion: { type: Boolean, default: false}
});

// Create the model
const Advertiser = mongoose.model('Advertiser', advertiserSchema);

module.exports = Advertiser;
