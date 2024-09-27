const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }, // hashed password
  id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'}, // serialized number for the seller's beta2a
  taxationRegCard: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Img'}, // serialized number for taxation registration card
  name: { type: String, required: true }, // name of the seller
  desc: { type: String, required: true }, // description of the seller's business
  logo: { type: mongoose.Schema.Types.ObjectId, ref: 'Img'}, // serialized number for the seller's logo
  acceptedTerms: { type: Boolean, default: false }, // initially false until accepted
  notifications: [
    {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
      productId: { type: Number }, // optional field
    },
  ],
  requestingDeletion: { type:Boolean, default: false}
});

// Create the model
const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
