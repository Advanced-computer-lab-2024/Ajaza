const mongoose = require("mongoose");

const flightBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: Date, required: true },
    count: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the model
const FlightBooking = mongoose.model("flightBooking", flightBookingSchema);

module.exports = FlightBooking;
