const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true},
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
      activityId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Activity'},
      total: { type: Number, required: true },
    },
  ],
  itineraryBookings: [
    {
      itineraryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Itinerary'},
      date: { type: Date, required: true},
      total: { type: Number, required: true },
    },
  ],
  activityBookmarks: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Activity'}],
  itineraryBookmarks: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Itinerary'}],
  notifications: [
    {
      text: { type: String, required: true },
      seen: { type: Boolean, default: false },
      activityId: { type: Number },
      itineraryId: { type: Number },
    },
  ],
  points: { type: Number, default: 0 }, //points updated after booking, if cancelled do not refund points from user
  totalPoints: { type: Number, default: 0 }, //determines badge whenever we increment points increment total points
  badge: { type: Number, default: 1 }, // level 1, 2, or 3
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product'}],
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Itinerary'},
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  orders: [
    {
      products: [{ productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Itinerary'}, quantity: { type: Number, required: true } }],
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
