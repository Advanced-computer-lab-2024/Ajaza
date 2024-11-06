const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    hotelName: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    score: { type: Number, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const HotelBooking = mongoose.model("hotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
