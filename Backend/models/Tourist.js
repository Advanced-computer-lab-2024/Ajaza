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
      activityId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Activity'},
      total: { type: Number, required: false },
    },
  ],
  itineraryBookings: [
    {
      itineraryId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Itinerary'},
      date: { type: Date, required: false },
      total: { type: Number, required: false },
    },
  ],
  activityBookmarks: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Activity'}],
  itineraryBookmarks: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Itinerary'}],
  notifications: [
    {
      text: { type: String, required: false },
      seen: { type: Boolean, default: false },
      activityId: { type: Number },
      itineraryId: { type: Number },
    },
  ],
  points: { type: Number, default: 0 }, //points updated after booking, if cancelled do not refund points from user
  totalPoints: { type: Number, default: 0 }, //determines badge whenever we increment points increment total points
  badge: { type: Number, default: 1 }, // level 1, 2, or 3
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Product'}],
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Itinerary'},
      quantity: { type: Number, required: false, default: 1 },
    },
  ],
  orders: [
    {
      products: [{ productId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Product'}, quantity: { type: Number, required: false } }],
      date: { type: Date, default: Date.now },
      cod: { type: Boolean, required: false },
      total: { type: Number, required: false },
      status: { type: String, enum: ['Delivered', 'Cancelled', 'Processing'], required: false },
    },
  ],
  deliveryAddresses: [
    {
      country: { type: String, required: false },
      city: { type: String, required: false },
      area: { type: String, required: false },
      street: { type: String, required: false },
      house: { type: Number, required: false },
      app: { type: Number },
      desc: { type: String },
    },
  ],
  usedPromoCodes: [{ type: String }],
  gaveFeedback: [{ type: mongoose.Schema.Types.ObjectId, required: false}],
  requestingDeletion: { type: Boolean, default: false },//ng added for deletion

});

// Create the model
const Tourist = mongoose.model('Tourist', touristSchema);

module.exports = Tourist;
