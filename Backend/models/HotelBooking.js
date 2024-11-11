const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    hotelName: { type: String, required: false },
    city: { type: String, required: false },
    price: { type: String, required: false },
    currency: { type: String, required: false },
    checkin: { type: String, required: false },
    checkout: { type: String, required: false },
    score: { type: String, required: false },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const HotelBooking = mongoose.model("hotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
