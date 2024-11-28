const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Unique promo code
  value: { type: Number, required: true }, // Discount value 0.2 for example
  birthday: {
    date: { type: Date, required: true }, // Date associated with the promo code
    touristIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }],
  },
});

// Create the model
const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
