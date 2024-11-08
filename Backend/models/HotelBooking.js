const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    hotelName: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: String, required: true },
    currency: { type: String, required: true },
    checkin: { type: String, required: true },
    checkout: { type: String, required: true },
    score: { type: String, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const HotelBooking = mongoose.model("hotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
