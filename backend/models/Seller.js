const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }, // hashed password
  id: { type: String, required: true }, // serialized number for the seller's image
  taxationRegCard: { type: String, required: true }, // serialized number for taxation registration card
  name: { type: String, required: true }, // name of the seller
  desc: { type: String, required: true }, // description of the seller's business
  logo: { type: String, required: true }, // serialized number for the seller's logo
  acceptedTerms: { type: Boolean, default: false }, // initially false until accepted
  notifications: [
    {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
      productId: { type: Number }, // optional field
    },
  ],
});

// Create the model
const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
