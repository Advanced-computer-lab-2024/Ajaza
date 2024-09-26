const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }, // hashed password
  mobile: { type: String, required: true },
  nationality: { type: String, required: true },
  dob: { type: Date, required: true },
  occupation: { type: String, required: true },
  joined: { type: Date, default: Date.now }, // auto set to current date
  wallet: { type: Number, default: 0 },
  activityBookings: [
    {
      activityId: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  itineraryBookings: [
    {
      itineraryId: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  activityBookmarks: [{ type: Number }],
  itineraryBookmarks: [{ type: Number }],
  notifications: [
    {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
      activityId: { type: Number },
      itineraryId: { type: Number },
    },
  ],
  points: { type: Number, default: 0 }, //points updated after booking, if cancelled do not refund points from user
  totalPoints: { type: Number, default: 0 }, //determines badge
  badge: { type: Number, default: 1 }, // level 1, 2, or 3
  wishlist: [{ type: Number }],
  cart: [
    {
      productId: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  orders: [
    {
      products: [{ productId: { type: Number, required: true }, quantity: { type: Number, required: true } }],
      date: { type: Date, default: Date.now },
      cod: { type: Boolean, required: true },
      total: { type: Number, required: true },
      status: { type: String, enum: ['Delivered', 'Cancelled', 'Processing'], required: true },
    },
  ],
  deliveryAddresses: [
    {
      country: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      street: { type: String, required: true },
      house: { type: Number, required: true },
      app: { type: Number },
      desc: { type: String },
    },
  ],
  usedPromoCodes: [{ type: String }],
});

// Create the model
const Tourist = mongoose.model('Tourist', touristSchema);

module.exports = Tourist;
