const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Unique promo code
  value: { type: Number, required: true }, // Discount value 0.2 for example
  birthday: {
    date: { type: Date, required: false }, // Date associated with the promo code
  },
});

// Static method to create a promo code without birthday
promoCodeSchema.statics.createWithoutBirthday = function (data) {
  return this.create({
    code: data.code,
    value: data.value,
  });
};

// Create the model
const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
