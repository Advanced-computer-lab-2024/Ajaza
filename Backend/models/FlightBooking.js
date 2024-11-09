const mongoose = require("mongoose");

const flightBookingSchema = new mongoose.Schema({
    touristId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tourist' },
    departureAirport: { type: String },
    totalDuration: { type: String },
    currency: { type: String },
    price: { type: String },
    departureTime: { type: String },
    departureTerminal: { type: String },
    arrivalAirport: { type: String },
    arrivalTime: { type: String },
    arrivalTerminal: { type: String },
    carrier: { type: String },
    flightNumber: { type: String },
    aircraft: { type: String },
    stops: { type: String },
});

// Create the model
const FlightBooking = mongoose.model("flightBooking", flightBookingSchema);

module.exports = FlightBooking;