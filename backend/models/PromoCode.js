const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Unique promo code
  value: { type: Number, required: true }, // Discount value (e.g., percentage or fixed amount)
  birthday: {
    date: { type: Date }, // Date associated with the promo code
    touristIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }], // References to tourists who can use the promo code
  },
});

// Create the model
const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
